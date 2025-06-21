// src/requests/comments.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(private readonly db: DatabaseService) {}

  async create(requestId: number, content: string, userId: number) {
    if (!requestId || !userId || !content.trim()) {
      throw new HttpException(
        'Неверные входные данные для комментария',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.db.comment.create({
        data: {
          content: content.trim(),
          requestId,
          userId,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('Ошибка при создании комментария', error);
      throw new HttpException(
        'Ошибка при добавлении комментария в базу данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
