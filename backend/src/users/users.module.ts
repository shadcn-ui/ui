import { Module, forwardRef } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { NotificationModule } from '../notifications/notification.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => NotificationModule),
    TelegramModule,
  ],
  providers: [UsersService, RolesGuard],
  controllers: [UsersController],
  exports: [UsersService, RolesGuard],
})
export class UsersModule {}
