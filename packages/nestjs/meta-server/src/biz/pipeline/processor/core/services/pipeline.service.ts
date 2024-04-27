import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { PIPELINE_BASE_STATUS_ENUM } from '../constants';
import { Pipeline } from '@/core/entities/pipeline/processor/pipeline.entity';
import { CreatePipelineDto } from '../../dto/pipeline.operate.dto';

@Injectable()
export class PipelineService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Pipeline)
    private readonly pipelineRepository: Repository<Pipeline>,
  ) {
    this.logger.setContext(PipelineService.name);
  }

  /**
   * 创建流水线
   * @param data
   * @returns
   */
  async createPipeline(data: CreatePipelineDto) {
    const result = await this.pipelineRepository.save({
      appId: data.appId,
      iterationId: data.iterationId,
      repoId: data.repoId,
      creator: data.creator,
      status: PIPELINE_BASE_STATUS_ENUM.CREATE,
      tplId: data.tplId,
      createTime: new Date(),
      updateTime: new Date(),
      branch: data.branch,
      content: data.content,
      extra: data.extra,
    });
    return result;
  }

  async findPipelineById(id: string) {
    const pipeline = await this.pipelineRepository.findOne({ where: { id } });
    return pipeline;
  }

  async modifyPipeline(id: string, data: Partial<any>) {
    const pipeline = await this.pipelineRepository.findOne({ where: { id } });
    // 执行过的stage 不能重复执行
    if (
      data.stageSeq !== undefined &&
      pipeline?.stageSeq &&
      pipeline.stageSeq > data.stageSeq
    ) {
      // todo 钉钉通知error
      return;
    }
    const result = await this.pipelineRepository.save({
      ...pipeline,
      ...data,
    });
    return result;
  }
}
