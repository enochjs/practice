import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import {
  CreatePipelineJobDto,
  ModifyPipelineJobDto,
} from '../../dto/pipeline.job.dto';
import { PipelineJob } from '@/core/entities/pipeline/processor/pipeline.job.entity';
import { PIPELINE_LISTENER_NAME_ENUM } from '@/biz/pipeline/processor/core/constants';

@Injectable()
export class PipelineJobService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(PipelineJob)
    private readonly pipelineJobRepository: Repository<PipelineJob>,
  ) {
    this.logger.setContext(PipelineJobService.name);
  }

  async createJob(data: CreatePipelineJobDto) {
    const result = await this.pipelineJobRepository.save({
      pipelineId: data.pipelineId,
      stageSeq: data.stageSeq,
      jobKey: data.jobKey,
      status: data.status,
      extra: data.extra,
      unitKey: data.unitKey,
      createTime: new Date(),
      updateTime: new Date(),
    });
    return result;
  }

  /**
   * 根据流水线id、stageSeq、jobKey查找job
   * @param pipelineId
   * @param stageSeq
   * @param jobKey
   * @returns
   */
  async findByPipelineStageSeqAndJobKey(
    pipelineId: string,
    stageSeq: number,
    jobKey: PIPELINE_LISTENER_NAME_ENUM,
  ) {
    return this.pipelineJobRepository.findOne({
      where: { stageSeq, jobKey, pipelineId },
    });
  }

  async updateJob(data: ModifyPipelineJobDto) {
    const job = await this.pipelineJobRepository.findOne({
      where: { id: data.id },
    });
    const result = await this.pipelineJobRepository.save({
      ...job,
      ...data,
      updateTime: new Date(),
    });
    return result;
  }

  async findByUnitKey(unitKey: string) {
    return this.pipelineJobRepository.findOne({
      where: { unitKey },
    });
  }
}
