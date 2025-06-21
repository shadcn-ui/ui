import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import axios from 'axios';
import { Notification } from '../entities/notification.entity';
import { Role, Department } from '../enums/user.enums';
import { DatabaseService } from '../database/database.service';
import { AdminLogsGateway } from '../admin/admin-logs.gateway';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;

  private sentCount = 0;
  private errorCount = 0;

  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => AdminLogsGateway))
    private readonly adminLogsGateway: AdminLogsGateway,
  ) {}

  /** 📬 Универсальная отправка уведомления */
  async sendFromNotification(notification: Notification) {
    const text = this.formatMessage(notification);
    if (!text) return;

    try {
      if (notification.userId) {
        await this.sendToUser(notification.userId, text);
      } else if (notification.role) {
        await this.sendToRole(notification.role, text);
      } else if (notification.department) {
        await this.sendToDepartment(notification.department, text);
      } else if (this.groupChatId) {
        await this.sendMessage(this.groupChatId, text);
      } else {
        this.logger.warn('⚠️ Не указан получатель уведомления в Telegram');
      }
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error('❌ Ошибка при отправке уведомления в Telegram', error.stack);
    }
  }

  /** 📤 Отправка одному пользователю */
  async sendToUser(userId: number, text: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (user?.telegramUserId) {
      await this.sendMessage(user.telegramUserId.toString(), text);
    } else {
      this.logger.warn(`⚠️ Пользователь ID=${userId} не имеет telegramUserId`);
    }
  }

  /** 🏢 Отправка в отдел */
  async sendToDepartment(department: Department, text: string) {
    const users = await this.db.user.findMany({
      where: { department, telegramUserId: Not(IsNull()) },
    });

    const chatIds = users
      .map((u) => u.telegramUserId?.toString())
      .filter((id): id is string => !!id);

    await this.sendToMany(chatIds, text);

    this.logger.log(`📨 Отправлено в отдел "${department}": ${chatIds.length} получателей`);
  }

  /** 🛡 Отправка по роли */
  async sendToRole(role: Role, text: string) {
    const users = await this.db.user.findMany({
      where: { role, telegramUserId: Not(IsNull()) },
    });

    const chatIds = users
      .map((u) => u.telegramUserId?.toString())
      .filter((id): id is string => !!id);

    await this.sendToMany(chatIds, text);

    this.logger.log(`📨 Отправлено по роли "${role}": ${chatIds.length} получателей`);
  }

  /** 📣 Рассылка всем, у кого есть Telegram ID */
  async broadcastToAll(text: string) {
    const users = await this.db.user.findMany({
      where: { telegramUserId: Not(IsNull()) },
    });

    const chatIds = users
      .map((u) => u.telegramUserId?.toString())
      .filter((id): id is string => !!id);

    await this.sendToMany(chatIds, text);

    this.logger.log(`📢 Общая рассылка выполнена: ${chatIds.length} получателей`);
  }

  /** 🔄 Множественная отправка */
  private async sendToMany(chatIds: string[], text: string) {
    for (const chatId of chatIds) {
      await this.sendMessage(chatId, text);
    }
  }

  /** 🧾 Отправка одного сообщения */
  async sendMessage(chatId: string | number, text: string) {
    if (!this.botToken || !chatId || !text) {
      this.logger.warn('⚠️ Недостаточно данных для отправки Telegram-сообщения');
      return;
    }

    try {
      await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
      this.sentCount++;
      try {
        this.adminLogsGateway.sendLog(`✅ [TG] отправлено в чат ${chatId}`);
      } catch (e) {}
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error(`❌ Ошибка отправки в чат ${chatId}: ${error.message}`, error.stack);
      this.errorCount++;
      try {
        this.adminLogsGateway.sendLog(`❌ [TG] ошибка отправки в чат ${chatId}: ${error.message}`);
      } catch (e) {}
    }
  }

  /** 🧱 Форматирование текста */
  private formatMessage(notification: Notification): string {
    return `<b>${notification.title}</b>\n\n${notification.message}`;
  }

  /** 📤 Отправка сообщения в групповой чат */
  async sendMessageToGroup(text: string) {
    if (!text || !this.groupChatId) {
      this.logger.warn('⚠️ Не указан текст или groupChatId');
      return;
    }
    return this.sendMessage(this.groupChatId, text);
  }

  /** 📊 Получить последние уведомления (для UI) */
  async getLatestNotifications() {
    return this.db.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        message: true,
        title: true,
        createdAt: true,
        department: true,
        role: true,
      userId: true,
      },
    });
  }

  getStats() {
    return { sent: this.sentCount, errors: this.errorCount };
  }
}
