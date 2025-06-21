import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NotificationModule } from '../notifications/notification.module';
import { UsersModule } from '../users/users.module';
import { News } from '../entities/news.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    forwardRef(() => UsersModule),
    NotificationModule,
  ],
  controllers: [NewsController],
  providers: [
    NewsService,
  ],
})
export class NewsModule {}
