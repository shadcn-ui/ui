import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { EquipmentModule } from './equipment/equipment.module';
import { SoftwareModule } from './software/software.module';
import { RequestsModule } from './requests/requests.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';

import { NotificationModule } from './notifications/notification.module';
import { TelegramModule } from './telegram/telegram.module';
import { NewsModule } from './news/news.module';
import { GuidesModule } from './guides/guides.module';
import { ReferenceModule } from './reference/reference.module';
import { AdminLogsGateway } from './admin/admin-logs.gateway'; // 👈 Добавлен импорт
import { User } from './entities/user.entity';
import { Equipment } from './entities/equipment.entity';
import { Request } from './entities/request.entity';
import { Comment } from './entities/comment.entity';
import { Notification } from './entities/notification.entity';
import { Software } from './entities/software.entity';
import { Guide } from './entities/guide.entity';
import { News } from './entities/news.entity';
import { RequestCategory } from './entities/request-category.entity';
import { RequestPriority } from './entities/request-priority.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [
        User,
        Equipment,
        Request,
        Comment,
        Notification,
        Software,
        Guide,
        News,
        RequestCategory,
        RequestPriority,
      ],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    EquipmentModule,
    SoftwareModule,
    RequestsModule,
    NotificationModule,
    TelegramModule,
    NewsModule,
    GuidesModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AdminLogsGateway, // 👈 Добавлен gateway для Live-логов!
  ],
})
export class AppModule {}
