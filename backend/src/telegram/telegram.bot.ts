import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from '../database/database.service';
import { AdminLogsGateway } from '../admin/admin-logs.gateway';
import { TelegramService } from './telegram.service';
import * as dotenv from 'dotenv';
import { Role } from '../enums/user.enums';

dotenv.config();

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const cleaned = digits.replace(/^8/, '7');
  return `+${cleaned}`;
}

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;
  private readonly logger = new Logger(TelegramBotService.name);

  constructor(
    private db: DatabaseService,
    private telegramService: TelegramService,
    @Inject(forwardRef(() => AdminLogsGateway))
    private readonly adminLogsGateway: AdminLogsGateway,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.error('TELEGRAM_BOT_TOKEN не задан в .env!');
      try {
        this.adminLogsGateway.sendLog('❌ [TG] TELEGRAM_BOT_TOKEN не указан');
      } catch (e) {}
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.logger.log('🤖 TelegramBotService запущен с polling');
    try {
      this.adminLogsGateway.sendLog('🤖 [TG] Bot запущен');
    } catch (e) {}

    this.bot.setMyCommands([
      { command: 'start', description: 'Приветствие' },
      { command: 'auth', description: 'Авторизация по номеру телефона' },
      { command: 'myrequests', description: 'Посмотреть мои заявки' },
      { command: 'admin', description: 'Меню администратора' },
    ]);

    this.initCommands();
  }

  private initCommands() {
    this.bot.onText(/\/start(?:\s+.*)?/, this.handleStart.bind(this));
    this.bot.onText(/\/auth/, this.handleAuth.bind(this));
    this.bot.on('contact', this.handleContact.bind(this));
    this.bot.onText(/\/myrequests/, this.handleMyRequests.bind(this));
    this.bot.onText(/\/admin/, this.handleAdmin.bind(this));
    this.bot.onText(/\/stats/, this.handleStats.bind(this));
  }

  private async handleStart(msg: TelegramBot.Message) {
    try {
      const chatId = msg.chat.id;
      const text = msg.text || '';
      const args = text.split(' ');
      const phoneArg = args[1];

      const existing = await this.db.user.findFirst({
        where: { telegramUserId: BigInt(chatId) },
      });

      if (phoneArg) {
        const normalizedPhone = normalizePhone(phoneArg);
        const userByPhone = await this.db.user.findFirst({
          where: { mobilePhone: normalizedPhone },
        });

        if (!userByPhone) {
          return this.bot.sendMessage(chatId, '🚫 Пользователь с таким номером не найден.');
        }

        if (userByPhone.telegramUserId) {
          if (BigInt(userByPhone.telegramUserId) === BigInt(chatId)) {
            return this.bot.sendMessage(chatId, '✅ Telegram уже привязан к вашему профилю.');
          }
          return this.bot.sendMessage(chatId, '⚠️ Этот номер уже привязан к другому аккаунту.');
        }

        await this.db.user.update({
          where: { id: userByPhone.id },
          data: { telegramUserId: BigInt(chatId) },
        });

        return this.bot.sendMessage(chatId, '✅ Telegram успешно привязан к профилю.');
      }

      if (existing) {
        return this.bot.sendMessage(
          chatId,
          `✅ Вы уже авторизованы как ${existing.firstName} ${existing.lastName} (${existing.role})`
        );
      }

      this.bot.sendMessage(
        chatId,
        `Здравствуйте, ${msg.from?.first_name || 'пользователь'}! 👋\n\nИспользуйте /auth для входа.`
      );
    } catch (error) {
      this.logger.error('Ошибка в handleStart:', error instanceof Error ? error.message : error);
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] handleStart: ${error instanceof Error ? error.message : error}`);
      } catch (e) {}
    }
  }

  private async handleAuth(msg: TelegramBot.Message) {
    try {
      const chatId = msg.chat.id;
      const user = await this.db.user.findFirst({
        where: { telegramUserId: BigInt(chatId) },
      });

      if (user) {
        return this.bot.sendMessage(
          chatId,
          `✅ Вы уже авторизованы как ${user.firstName} ${user.lastName} (${user.role})`
        );
      }

      this.bot.sendMessage(chatId, '📱 Для входа отправьте свой номер телефона:', {
        reply_markup: {
          keyboard: [[{ text: '📲 Отправить номер', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } catch (error) {
      this.logger.error('Ошибка в handleAuth:', error instanceof Error ? error.message : error);
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] handleAuth: ${error instanceof Error ? error.message : error}`);
      } catch (e) {}
    }
  }

  private async handleContact(msg: TelegramBot.Message) {
    try {
      const chatId = msg.chat.id;
      const rawPhone = msg.contact?.phone_number;

      if (!rawPhone) {
        return this.bot.sendMessage(chatId, '❗ Номер телефона не получен.');
      }

      const normalizedPhone = normalizePhone(rawPhone);

      const user = await this.db.user.findFirst({
        where: { mobilePhone: normalizedPhone },
      });

      if (!user) {
        return this.bot.sendMessage(chatId, '🚫 Пользователь с таким номером не найден.');
      }

      await this.db.user.update({
        where: { id: user.id },
        data: { telegramUserId: BigInt(chatId) },
      });

      this.bot.sendMessage(
        chatId,
        `✅ Вы авторизованы как ${user.firstName} ${user.lastName} (${user.role})`
      );
    } catch (error) {
      this.logger.error('Ошибка в handleContact:', error instanceof Error ? error.message : error);
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] handleContact: ${error instanceof Error ? error.message : error}`);
      } catch (e) {}
    }
  }

  private async handleMyRequests(msg: TelegramBot.Message) {
    try {
      const chatId = msg.chat.id;
      const user = await this.db.user.findFirst({
        where: { telegramUserId: BigInt(chatId) },
        include: { requests: true },
      });

      if (!user) {
        return this.bot.sendMessage(chatId, '❗ Вы не авторизованы. Используйте /auth.');
      }

      if (!user.requests || user.requests.length === 0) {
        return this.bot.sendMessage(chatId, '📭 У вас пока нет заявок.');
      }

      const text = user.requests
        .map(r => `📌 ${r.title} — [${r.status}] от ${new Date(r.createdAt).toLocaleDateString('ru-RU')}`)
        .join('\n');

      this.bot.sendMessage(chatId, `Ваши заявки:\n\n${text}`);
    } catch (error) {
      this.logger.error('Ошибка в handleMyRequests:', error instanceof Error ? error.message : error);
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] handleMyRequests: ${error instanceof Error ? error.message : error}`);
      } catch (e) {}
    }
  }

  private async handleStats(msg: TelegramBot.Message) {
    try {
      const chatId = msg.chat.id;
      const user = await this.db.user.findFirst({
        where: {
          telegramUserId: BigInt(chatId),
          role: { in: ['admin', 'superuser'] as Role[] },
        },
      });

      if (!user) {
        return this.bot.sendMessage(chatId, '⛔️ Доступ только для администратора.');
      }

      const stats = this.telegramService.getStats();
      this.bot.sendMessage(
        chatId,
        `📊 Статистика Telegram:\nОтправлено: ${stats.sent}\nОшибок: ${stats.errors}`,
      );
    } catch (error) {
      this.logger.error('Ошибка в handleStats:', error instanceof Error ? error.message : error);
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] Ошибка в /stats: ${error instanceof Error ? error.message : error}`);
      } catch (e) {}
    }
  }

  private async handleAdmin(msg: TelegramBot.Message) {
    try {
      const chatId = msg.chat.id;

      const user = await this.db.user.findFirst({
        where: {
          telegramUserId: BigInt(chatId),
          role: { in: ['admin', 'superuser'] as Role[] },
        },
      });

      if (!user) {
        return this.bot.sendMessage(chatId, '⛔️ Доступ только для администратора или суперпользователя.');
      }

      this.bot.sendMessage(chatId, `🛠 Админ-панель:\n\n📢 /broadcast\n📊 /stats\n👥 /finduser`);
    } catch (error) {
      this.logger.error('Ошибка в handleAdmin:', error instanceof Error ? error.message : error);
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] handleAdmin: ${error instanceof Error ? error.message : error}`);
      } catch (e) {}
    }
  }
}
