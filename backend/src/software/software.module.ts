import { Module, forwardRef } from '@nestjs/common';
import { SoftwareService } from './software.service';
import { SoftwareController } from './software.controller';
import { NotificationModule } from '../notifications/notification.module';
import { UsersModule } from '../users/users.module'; // <--- добавь это

@Module({
  imports: [
    forwardRef(() => NotificationModule),
    forwardRef(() => UsersModule),  // <--- добавь вот так!
  ],
  controllers: [SoftwareController],
  providers: [SoftwareService],
  exports: [SoftwareService],
})
export class SoftwareModule {}
