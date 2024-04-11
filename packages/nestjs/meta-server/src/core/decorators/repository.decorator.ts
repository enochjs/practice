import { ServiceException } from '@/core/execptions/service.exception';

export function repositoryWrapper(key?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        const result = await method.apply(this, args);
        this.logger.info(
          `${
            this.constructor.name
          }.${propertyKey} params ${key}: ${JSON.stringify(
            args,
          )}, result:${JSON.stringify(result)}`,
        );
        return result;
      } catch (error) {
        this.logger.info(error);
        throw new ServiceException(
          `${this.constructor.name}.${propertyKey} ${key || ''}: ${
            error.sqlMessage || error.message
          }`,
        );
      }
    };
  };
}
