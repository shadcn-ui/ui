import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notifications/notification.service';
import { Role } from '../enums/user.enums';
// ✅ Импортируем NotificationType из DTO!
import { NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notifications: NotificationService,
  ) {}

  async getAll() {
    return this.db.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    const news = await this.db.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return news;
  }

  async create(data: { title: string; content: string }) {
    const created = await this.db.news.create({
      data: {
        title: data.title.trim().slice(0, 200),
        content: data.content.trim(),
      },
    });

    // ✅ Исправлено: тип только через enum NotificationType
    await this.notifications.create({
      role: Role.user,
      title: '📰 Новая новость',
      message: `Появилась новая новость: "${created.title}"`,
      type: NotificationType.NEWS,
      url: `/dashboard`,
    });

    return created;
  }

  async update(id: number, data: { title?: string; content?: string }) {
    const news = await this.db.news.findUnique({ where: { id } });

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return this.db.news.update({
      where: { id },
      data: {
        title: data.title?.trim().slice(0, 200) ?? news.title,
        content: data.content?.trim() ?? news.content,
      },
    });
  }

  async delete(id: number) {
    return this.db.news.delete({
      where: { id },
    });
  }
}
