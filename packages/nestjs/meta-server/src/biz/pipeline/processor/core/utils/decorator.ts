import { AsyncLocalStorage } from 'async_hooks';
import {
  PIPELINE_BASE_STATUS_ENUM,
  PIPELINE_LISTENER_NAME_ENUM,
  SEPARATION,
} from '../constants';
import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { EVENT_LISTENER_METADATA } from '@nestjs/event-emitter/dist/constants';
import { BaseListener } from '../listeners/base.listener';
export const asyncLocalStorage = new AsyncLocalStorage();

// set pipelineId for logger
export function asyncLocalStorageWrapper(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const method = descriptor.value;
  descriptor.value = async function (payload: any) {
    try {
      asyncLocalStorage.run(payload.pipelineId, async () => {
        await method.call(this, payload);
      });
    } catch (error) {}
  };
}

// setEventName in job listener
export function ListenerWrapper(eventName: string) {
  return function (constructor: Function) {
    constructor.prototype.eventName = eventName;
  };
}

// eventWrapper
// 1. 注册pipelineId，logger 可以自动打印 pipelineId，方便排查问题
// 2. 注册事件监听器
// 3. 统一处理异常
export const OnEventWrapper = (
  status: PIPELINE_BASE_STATUS_ENUM,
): MethodDecorator => {
  const decoratorFactory = (target: any, key: any, descriptor: any) => {
    const method = descriptor.value;
    // set pipelineId for logger，
    descriptor.value = function (payload: any) {
      try {
        asyncLocalStorage.run(payload.pipelineId, async () => {
          try {
            await method.call(this, payload);
          } catch (error) {
            handleError.call(this, payload, error);
          }
        });
      } catch (error) {
        handleError.call(this, payload, error);
      }
    };

    // 由于方法装饰器是在类装饰器之前执行的，这里还拿不到 类装饰器中设置的eventName
    // 所以这里使用 Promise.resolve().then() 来保证能拿到类装饰器中设置的eventName
    Promise.resolve().then(() => {
      extendArrayMetadata(
        EVENT_LISTENER_METADATA,
        [
          {
            event: `${target.eventName}${SEPARATION}${status}`,
          },
        ],
        descriptor.value,
      );
    });

    return descriptor;
  };
  decoratorFactory.KEY = EVENT_LISTENER_METADATA;
  return decoratorFactory;
};

async function handleError(this: BaseListener, payload: any, error: Error) {
  this.logger.log({
    ...error,
    message: error.message,
    stack: error.stack,
    type: 'job execute error',
    eventname: payload.eventName,
    params: payload,
  });
  // TODO: send message to robot
  // await this.pipelineService.sendLinkMessage({
  //   pipelineId: payload.pipelineId,
  //   msg: JSON.stringify({
  //     ...error,
  //     message: error.message,
  //     ...payload,
  //   }),
  // });
  this.pipelineProcessor.emitEvent(
    PIPELINE_LISTENER_NAME_ENUM.PIPELINE,
    PIPELINE_BASE_STATUS_ENUM.FAILED,
    payload,
  );
}
