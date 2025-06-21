import { Controller, Get, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TelegramService } from '../telegram/telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// --- Пример простого кастомного декоратора для ролей ---
function Roles(...roles: string[]) {
  return (target: any, key?: any, descriptor?: any) => {
    Reflect.defineMetadata('roles', roles, descriptor ? descriptor.value : target);
  };
}

// --- Universal guard (если нужен): ---
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const handler = context.getHandler();
    const allowedRoles = Reflect.getMetadata('roles', handler) || [];
    return !allowedRoles.length || allowedRoles.includes(user?.role);
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // <--- Добавил универсальный guard!
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly telegramService: TelegramService
  ) {}

  @Get('stats')
  @Roles('admin', 'superuser')
  async getStats(): Promise<{ users: number; equipment: number; requests: number }> {
    return this.adminService.getStats();
  }

  @Get('stats-requests')
  @Roles('admin', 'superuser')
  async getRequestStats(): Promise<{
    byStatus: { status: string; count: number }[];
    bySource: { source: string; count: number }[];
  }> {
    return this.adminService.getRequestStats();
  }

  @Get('telegram-feed')
  @Roles('admin', 'superuser')
  async getTelegramFeed(@Req() req) {
    const user = req.user;
    if (!user || !['admin', 'superuser'].includes(user.role)) {
      throw new ForbiddenException('Доступ запрещён');
    }
    return this.telegramService.getLatestNotifications();
  }

  // --- НОВЫЕ МАРШРУТЫ ---

  @Get('calendar-requests')
  @Roles('admin', 'superuser')
  async getCalendarRequests() {
    return this.adminService.getCalendarRequests();
  }

  @Get('insights')
  @Roles('admin', 'superuser')
  async getInsights() {
    return this.adminService.getInsights();
  }

  @Get('hourly-activity')
  @Roles('admin', 'superuser')
  async getHourlyActivity() {
    return this.adminService.getHourlyActivity();
  }

  @Get('monitoring')
  @Roles('admin', 'superuser')
  async getMonitoring() {
    return this.adminService.getMonitoring();
  }
}
