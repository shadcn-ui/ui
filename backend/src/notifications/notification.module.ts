import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module'; // <-- добавь это!

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TelegramModule, // <-- обязательно!
  ],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
