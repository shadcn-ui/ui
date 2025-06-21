import { Module, OnModuleInit, Logger, forwardRef } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramBotService } from './telegram.bot';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  providers: [TelegramService, TelegramBotService],
  exports: [TelegramService, TelegramBotService], // экспортируем оба
})
export class TelegramModule implements OnModuleInit {
  constructor(private readonly bot: TelegramBotService) {}

  async onModuleInit() {
    Logger.log('🤖 TelegramBotService initializing...');
    // bot уже запускается внутри конструктора TelegramBotService (polling)
  }
}
