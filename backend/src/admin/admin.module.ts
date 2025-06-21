import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TelegramModule } from '../telegram/telegram.module';
import { AdminLogsGateway } from './admin-logs.gateway'; // ✅ Live-лог Gateway

@Module({
  imports: [
    forwardRef(() => TelegramModule),
    // Если планируешь circular dependencies — можно добавить forwardRef,
    // но для базового случая не нужно
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminLogsGateway, // ✅ Подключаем gateway к провайдерам
  ],
  exports: [
    AdminService,
    AdminLogsGateway, // ✅ Экспортируй, если лог нужен в других модулях (например, RequestsService)
  ],
})
export class AdminModule {}
