import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import configuration from 'config/configuration';
// import FormData from 'form-data';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class GitService {
  private api: string;
  private accessToken: string;
  private namespaceId: number;

  constructor(
    private readonly logger: PinoLogger,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
  ) {
    this.logger.setContext(GitService.name);
    const git = this.configService.git;
    this.api = git.api;
    this.accessToken = git.accessToken;
    this.namespaceId = git.namespaceId;
  }

  async axiosAdaptor(config: AxiosRequestConfig) {
    try {
      const _config = {
        ...config,
        url: `${this.api}${config.url}`,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${this.accessToken}`,
        },
      };
      const result = await axios(_config);
      return result.data;
    } catch (error) {
      this.logger.error(error.response.data);
      return {
        error: error.response.data,
      };
    }
  }

  async getBranchInfo(data: { projectId: number; branch: string }) {
    const result = await this.axiosAdaptor({
      url: `/projects/${data.projectId}/repository/branches/${data.branch}`,
      method: 'GET',
    });
    return result;
  }

  async getCommits(data: {
    projectId: number;
    ref?: string;
    pageSize: number;
    current: number;
    since?: string;
    until?: string;
    withStats?: boolean;
  }) {
    const result = await this.axiosAdaptor({
      url: `/projects/${data.projectId}/repository/commits`,
      method: 'GET',
      params: {
        id: data.projectId,
        ref_name: data.ref,
        since: data.since,
        until: data.until,
        per_page: data.pageSize,
        page: data.current,
        with_stats: data.withStats,
      },
    });
    return result;
  }

  async compare(data: { projectId: number; source: string; target: string }) {
    if (!data.projectId) {
      return null;
    }
    const result = await this.axiosAdaptor({
      url: `/projects/${data.projectId}/repository/compare`,
      method: 'GET',
      params: {
        from: data.source,
        to: data.target,
      },
    });
    return result;
  }

  async checkNeedMerge(data: {
    projectId: number;
    sourceBranch: string;
    targetBranch: string;
  }) {
    const source = await this.getBranchInfo({
      projectId: data.projectId,
      branch: data.sourceBranch,
    });
    const result = await this.getCommits({
      projectId: data.projectId,
      ref: data.targetBranch,
      since: source.commit.committed_date,
      pageSize: 500,
      current: 1,
    });
    const findSourceCommit = result.find((item) => {
      return (
        item.id === source.commit.id ||
        item.parent_ids?.includes(source.commit.id)
      );
    });
    // compare 拿目标分支合当前分支比较，目标分支落后 diff length !== 0, 当前分支落后，diff===[]
    // source 要写成 data.targetBranch（目标分支）
    const compare = await this.compare({
      projectId: data.projectId,
      source: data.targetBranch,
      target: data.sourceBranch,
    });
    // 没有找到commit
    return !findSourceCommit && compare?.diffs?.length;
  }

  async createMergeRequest(data: {
    projectId: number;
    sourceBranch: string;
    targetBranch: string;
  }) {
    return this.axiosAdaptor({
      url: `/projects/${data.projectId}/merge_requests`,
      method: 'POST',
      data: {
        source_branch: data.sourceBranch,
        target_branch: data.targetBranch,
        title: `Merge ${data.sourceBranch} into ${data.targetBranch}`,
      },
    });
  }

  async getMergeRequest(data: { projectId: number; iid: number }) {
    const result = await this.axiosAdaptor({
      url: `/projects/${data.projectId}/merge_requests/${data.iid}`,
      method: 'get',
    });
    return result;
  }

  async acceptMergeRequest(data: { projectId: number; iid: number }) {
    const result = await this.axiosAdaptor({
      url: `/projects/${data.projectId}/merge_requests/${data.iid}/merge`,
      method: 'put',
      data: {
        id: data.projectId,
        merge_request_iid: data.iid,
      },
    });
    return result;
  }
}
