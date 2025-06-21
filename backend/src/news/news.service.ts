import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../entities/news.entity';
import { NotificationService } from '../notifications/notification.service';
import { Role } from '../enums/user.enums';
// Импорт только из DTO!
import { NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
    private readonly notifications: NotificationService,
  ) {}

  async getAll(opts?: { limit?: number; offset?: number }) {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      skip: opts?.offset ?? 0,
      take: opts?.limit ?? 10,
    });
  }

  async getById(id: number) {
    const news = await this.repo.findOne({ where: { id } });

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return news;
  }

  async create(data: { title: string; content: string }) {
    const created = await this.repo.save(
      this.repo.create({
        title: data.title.trim().slice(0, 200),
        content: data.content.trim(),
      }),
    );

    // Уведомление всем пользователям через enum NotificationType
    await this.notifications.create({
      role: Role.user,
      title: '📰 Новая новость',
      message: `Появилась новость: "${created.title}"`,
      type: NotificationType.NEWS,
      url: `/dashboard`,
    });

    return created;
  }

  async update(id: number, data: { title?: string; content?: string }) {
    const news = await this.repo.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }
    news.title = data.title?.trim().slice(0, 200) ?? news.title;
    news.content = data.content?.trim() ?? news.content;
    return this.repo.save(news);
  }

  async delete(id: number) {
    const news = await this.repo.findOne({ where: { id } });
    if (!news) throw new NotFoundException('Новость не найдена');
    await this.repo.remove(news);
    return news;
  }
}
