import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { PinoLogger } from 'nestjs-pino';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import configuration from 'config/configuration';
import dingtalkoauth2_1_0, * as $dingtalkoauth2_1_0 from '@alicloud/dingtalk/oauth2_1_0';
import dingtalkworkflow_1_0, * as $dingtalkworkflow_1_0 from '@alicloud/dingtalk/workflow_1_0';
import * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import axios from 'axios';

@Injectable()
export class DdService {
  private appKey: string;
  private appSecret: string;
  private approveCode: string;

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
    this.approveCode = dd.approveCode;
  }

  async getToken() {
    const config = new $OpenApi.Config({});
    config.protocol = 'https';
    config.regionId = 'central';
    const client = new dingtalkoauth2_1_0(config);
    const getAccessTokenRequest = new $dingtalkoauth2_1_0.GetAccessTokenRequest(
      {
        appKey: this.appKey,
        appSecret: this.appSecret,
      },
    );
    try {
      const result = await client.getAccessToken(getAccessTokenRequest);
      this.logger.info(
        '=======获取钉钉 token 成功, %s',
        result.body?.accessToken,
      );
      return result.body.accessToken;
    } catch (err) {
      this.logger.info('获取钉钉 token 失败, %j', err);
    }
  }

  async getUserInfo() {
    const token = await this.getToken();
    const result = await axios({
      method: 'POST',
      url: `https://oapi.dingtalk.com/topapi/v2/user/getbymobile?access_token=${token}`,
      data: {
        mobile: '18238071809',
      },
    });
    return result.data;
  }

  async createApproveInstance(data: {
    appName: string;
    env: string;
    version: string;
    content: string;
    originatorUserId: string;
    approveUserIds: string[];
    approveType: 'AND' | 'OR';
  }) {
    const config = new $OpenApi.Config({});
    config.protocol = 'https';
    config.regionId = 'central';
    const client = new dingtalkworkflow_1_0(config);
    const startProcessInstanceHeaders =
      new $dingtalkworkflow_1_0.StartProcessInstanceHeaders({});
    const token = await this.getToken();
    startProcessInstanceHeaders.xAcsDingtalkAccessToken = token;

    const params = [
      {
        name: '发布应用',
        value: data.appName,
        componentType: 'TextField',
      },
      {
        name: '发布环境',
        value: 'dev',
        componentType: 'TextField',
      },
      {
        name: '发布版本',
        value: '1.0.0',
        componentType: 'TextField',
      },
      {
        name: '发布内容',
        value: '测试发布',
        componentType: 'TextField',
      },
    ];

    const formComponentValues = params.map(
      (item) =>
        new $dingtalkworkflow_1_0.StartProcessInstanceRequestFormComponentValues(
          item,
        ),
    );

    const approvers =
      new $dingtalkworkflow_1_0.StartProcessInstanceRequestApprovers({
        actionType:
          data.approveUserIds?.length > 1 ? data.approveType : undefined,
        userIds: data.approveUserIds,
      });

    const startProcessInstanceRequest =
      new $dingtalkworkflow_1_0.StartProcessInstanceRequest({
        originatorUserId: 'manager1124',
        processCode: this.approveCode,
        approvers: [approvers],
        formComponentValues: formComponentValues,
      });
    try {
      const result = await client.startProcessInstanceWithOptions(
        startProcessInstanceRequest,
        startProcessInstanceHeaders,
        new $Util.RuntimeOptions({}),
      );
      this.logger.info('=======创建审批实例成功, %j', result);
      return result.body.instanceId;
    } catch (err) {
      if (!Util.empty(err.code) && !Util.empty(err.message)) {
        // err 中含有 code 和 message 属性，可帮助开发定位问题
      }
    }
  }
}
