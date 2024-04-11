import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PipelineModule } from './pipeline/pipeline.module';

@Module({
  imports: [UserModule, PipelineModule],
})
export class BizModule {}
