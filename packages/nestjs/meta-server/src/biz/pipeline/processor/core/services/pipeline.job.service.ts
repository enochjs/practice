import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import {
  CreatePipelineJobDto,
  ModifyPipelineJobDto,
} from '../../dto/pipeline.job.dto';
import { PipelineJob } from '@/core/entities/pipeline/processor/pipeline.job.entity';

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
      createTime: moment().unix(),
      updateTime: moment().unix(),
    });
    return result;
  }

  async updateJob(data: ModifyPipelineJobDto) {
    const job = await this.pipelineJobRepository.findOne({
      where: { id: data.id },
    });
    const result = await this.pipelineJobRepository.save({
      ...job,
      ...data,
      updateTime: moment().unix(),
    });
    return result;
  }
}
