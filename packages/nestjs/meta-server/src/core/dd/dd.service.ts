import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { Cache } from 'cache-manager';
import DingTalkEncryptor from './dingTalkEncryptor';
import { PinoLogger } from 'nestjs-pino';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DingDingTokenPrefix } from '@/constants/token';
import configuration from 'config/configuration';
import { DWClient, DWClientDownStream, EventAck } from './streamSdk/client';
import {
  RobotMessage,
  TOPIC_AI_GRAPH_API,
  TOPIC_ROBOT,
} from './streamSdk/constants';

@Injectable()
export class DdService {
  private appKey: string;
  private appSecret: string;
  private agentId: number;
  private aesKey: string;
  private aesToken: string;
  private approveCode: string;
  private client: DWClient;

  constructor(
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
    private readonly logger: PinoLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.logger.setContext(DdService.name);
    const dd = this.configService.dd;
    this.appKey = dd.appKey;
    this.appSecret = dd.appSecret;
    this.agentId = dd.agentId;
    this.aesKey = dd.aesKey;
    this.aesToken = dd.aesToken;
    this.approveCode = dd.approveCode;
    // this.client = new DWClient({
    //   clientId: this.appKey,
    //   clientSecret: this.appSecret,
    // });
    this.initClient();
  }

  private initClient() {
    this.client = new DWClient({
      clientId: this.appKey,
      clientSecret: this.appSecret,
    });

    this.client.registerCallbackListener(TOPIC_ROBOT, async (res) => {
      // 注册机器人回调事件
      console.log('收到消息', res);
      // const {messageId} = res.headers;
      const { text, senderStaffId, sessionWebhook } = JSON.parse(
        res.data,
      ) as RobotMessage;
      const body = {
        at: {
          atUserIds: [senderStaffId],
          isAtAll: false,
        },
        text: {
          content:
            'nodejs-getting-started say : 收到，' + text?.content ||
            '钉钉,让进步发生',
        },
        msgtype: 'text',
      };

      const accessToken = await this.client.getAccessToken();
      const result = await axios({
        url: sessionWebhook,
        method: 'POST',
        responseType: 'json',
        data: body,
        headers: {
          'x-acs-dingtalk-access-token': accessToken,
        },
      });

      // stream模式下，服务端推送消息到client后，会监听client响应，如果消息长时间未响应会在一定时间内(60s)重试推消息，可以通过此方法返回消息响应，避免多次接收服务端消息。
      // 机器人topic，可以通过socketCallBackResponse方法返回消息响应
      if (result?.data) {
        this.client.socketCallBackResponse(res.headers.messageId, result.data);
      }
    });
    this.client
      .registerCallbackListener(
        TOPIC_AI_GRAPH_API,
        async (res: DWClientDownStream) => {
          // 注册AI插件回调事件
          console.log('收到ai消息');
          const { messageId } = res.headers;

          // 添加业务逻辑
          console.log(res);
          console.log(JSON.parse(res.data));

          // 通过Stream返回数据
          this.client.sendGraphAPIResponse(messageId, {
            response: {
              statusLine: {
                code: 200,
                reasonPhrase: 'OK',
              },
              headers: {},
              body: JSON.stringify({
                text: '你好',
              }),
            },
          });
        },
      )
      .registerAllEventListener((message: DWClientDownStream) => {
        console.log('=====', message);
        return { status: EventAck.SUCCESS };
      })
      .connect();
  }

  private async axiosAdaptor<T>(
    method: AxiosRequestConfig['method'],
    path: string,
    data: T,
    params: T,
  ) {
    const result = await axios({
      method,
      url: `https://oapi.dingtalk.com/${path}`,
      data,
      params,
    });
    this.logger.info(
      `${method} ${path}, result:${JSON.stringify(result.data, null, 2)}`,
    );
    return result.data;
  }

  async getToken() {
    const cacheToken = await this.cacheManager.get(DingDingTokenPrefix);
    this.logger.info(`cacheToken: ${cacheToken}`);
    if (cacheToken) {
      return cacheToken;
    }
    const result = await this.axiosAdaptor('get', 'gettoken', null, {
      appkey: this.appKey,
      appsecret: this.appSecret,
    });
    if (result.errcode === 0) {
      await this.cacheManager.set(
        DingDingTokenPrefix,
        result.access_token,
        result.expires_in - 60,
      );
      return result.access_token;
    }
    return null;
  }

  decrypt(encrypt: string) {
    const dingTalkEncryptor = new DingTalkEncryptor(
      this.aesToken,
      this.aesKey,
      this.appKey,
    );
    const decrypt = dingTalkEncryptor.decrypt(encrypt);
    try {
      return JSON.parse(decrypt);
    } catch (error) {
      this.logger.info(`parse decrypt error, ${error}`);
      return null;
    }
  }

  getEncryptedMap(params: { timestamp: string; nonce: string; text: string }) {
    const dingTalkEncryptor = new DingTalkEncryptor(
      this.aesToken,
      this.aesKey,
      this.appKey,
    );
    const result = dingTalkEncryptor.getEncryptedMap(
      params.text,
      +params.timestamp,
      params.nonce,
    );
    return result;
  }

  async createApprove(params: {
    operateDDUserId: string;
    values: {
      name: string;
      value: string;
    }[];
    approvers: Record<string, any>;
  }) {
    const token = await this.getToken();

    const _params: any = {
      agent_id: this.agentId,
      process_code: this.approveCode,
      originator_user_id: params.operateDDUserId,
      dept_id: -1,
      form_component_values: params.values,
      ...params.approvers,
    };

    const result = await this.axiosAdaptor(
      'post',
      'topapi/processinstance/create',
      _params,
      {
        access_token: token,
      },
    );
    return result;
  }
}
