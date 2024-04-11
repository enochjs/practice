import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { PipelineTpl } from '@/core/entities/pipeline/template/pipeline.tpl.entity';
import { CreatePipelineTplDto, ModifyPipelineTplDto } from './dto/opreate.dto';
import { BusinessException } from '@/core/execptions/business.exception';

@Injectable()
export class PipelineTplService {
  constructor(
    @InjectRepository(PipelineTpl)
    private readonly pipelineTplRepository: Repository<PipelineTpl>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PipelineTplService.name);
  }

  create(data: CreatePipelineTplDto) {
    return this.pipelineTplRepository.save({
      ...data,
      stages: data.stages.map((stage, index) => ({
        ...stage,
        seq: index,
        jobs: stage.jobs.map((job) => ({
          ...job,
          stageSeq: index,
        })),
      })),
      createTime: new Date(),
      updateTime: new Date(),
    });
  }

  update(data: ModifyPipelineTplDto) {
    const tpl = this.pipelineTplRepository.findOne({
      where: { id: data.id },
    });

    if (!tpl) {
      this.logger.error('流水线模板不存在 pipelineTplId: ', data.id);
      throw new BusinessException('流水线模板不存在');
    }

    return this.pipelineTplRepository.save({
      ...data,
      stages: data.stages?.map((stage, index) => ({
        ...stage,
        seq: index,
        jobs: stage.jobs.map((job) => ({
          ...job,
          stageSeq: index,
        })),
      })),
      updateTime: new Date(),
    });
  }

  async findById(id: number) {
    const result = await this.pipelineTplRepository.findOne({
      where: { id },
    });
    this.logger.info('findById', result);
    return result;
  }
}
