import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Получить список уведомлений для текущего пользователя.
   */
  @Get()
  async getUserNotifications(@Req() req: Request) {
    const user = req.user as any;
    const userId = user.userId ?? user.id;
    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.notificationService.getUserNotifications(userId);
  }

  /**
   * Получить количество непрочитанных уведомлений для текущего пользователя.
   */
  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const user = req.user as any;
    const userId = user.userId ?? user.id;
    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.notificationService.getUnreadCount(userId);
  }

  /**
   * Отметить уведомление как прочитанное.
   */
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  /**
   * Только админ: создать уведомление (персональное, по роли или по отделу).
   */
  @Post('send')
  @Roles('admin')
  async sendNotification(@Body() payload: CreateNotificationDto) {
    return this.notificationService.create(payload);
  }
}
