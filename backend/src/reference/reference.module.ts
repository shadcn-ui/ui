import { Module } from '@nestjs/common';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';

@Module({
  controllers: [ReferenceController],
  providers: [ReferenceService],
})
export class ReferenceModule {}
