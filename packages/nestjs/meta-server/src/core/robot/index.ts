import { Injectable } from '@nestjs/common';
import axios from 'axios';
import crypto from 'crypto';

interface RobotData {
  host: string;
  env: string;
  uuid: string;
  message: string;
  method: string;
  path: string;
  param: string;
}
@Injectable()
export class RobotService {
  constructor() {}

  private sign = (timestamp: number) => {
    const secret =
      'SECf48d60c391536797cae6452fd28a79c6409b3ba3e6eb9c6288378ceb7c6b55c6';
    // 加签
    const str = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}\n${secret}`)
      .digest()
      .toString('base64');
    return encodeURIComponent(str);
  };

  async axiosAdaptor<T>(data: T) {
    const timestamp = new Date().getTime();
    const result = await axios({
      method: 'post',
      url: `https://oapi.dingtalk.com/robot/send?access_token=de368bf1e9bbdf472812911de36d009b4e3636aa46a5a263ffba99aa8e863f94&timestamp=${timestamp}&sign=${this.sign(
        timestamp,
      )}`,
      data,
    });
    return result.data;
  }

  async send(data: RobotData) {
    const msg = {
      msgtype: 'markdown',
      markdown: {
        title: `mozart_${data.method}_${data.path}_${data.path} 请求失败`,
        text: `### host_env \n${data.host}_${data.env} \n### method_path \n${data.method}_${data.path} \n###  \n### uuid \n${data.uuid} \n### 详细错误信息 \n   ${data.message}\n\n### 请求参数\n   ${data.param} \n\n`,
      },
    };
    const result = await this.axiosAdaptor(msg);
    return result;
  }
}
