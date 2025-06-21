import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';
import { Guide } from '../entities/guide.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guide]), forwardRef(() => UsersModule)],
  controllers: [GuidesController],
  providers: [GuidesService],
})
export class GuidesModule {}
