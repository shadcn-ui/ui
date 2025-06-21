import { Module, forwardRef } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notifications/notification.module';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admin/admin.module'; // <-- Добавляем AdminModule для Live-логов

@Module({
  imports: [
    AuthModule,
    NotificationModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule), // <-- Для доступа к AdminLogsGateway через DI
  ],
  controllers: [
    RequestsController,
    CommentsController,
  ],
  providers: [
    RequestsService,
    CommentsService,
  ],
  exports: [
    RequestsService,
    CommentsService,
  ],
})
export class RequestsModule {}
