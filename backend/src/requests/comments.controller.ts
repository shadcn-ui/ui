// src/requests/comments.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('requests/:requestId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async addComment(
    @Param('requestId') requestId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    const user = req.user as { id?: number; userId?: number };
    const userId = user.userId ?? user.id;

    const numericRequestId = parseInt(requestId, 10);

    if (isNaN(numericRequestId) || numericRequestId <= 0) {
      throw new BadRequestException('Некорректный ID заявки');
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      throw new BadRequestException('Комментарий не может быть пустым');
    }

    if (!userId) {
      throw new BadRequestException('Не удалось определить пользователя');
    }

    try {
      this.logger.log(
        `Добавление комментария в заявку ID=${numericRequestId} от пользователя ID=${userId}`,
      );
      return await this.commentsService.create(numericRequestId, content.trim(), userId);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Ошибка при добавлении комментария', error.stack || error.message);
      } else {
        this.logger.error('Ошибка при добавлении комментария', String(error));
      }
      throw new InternalServerErrorException('Не удалось добавить комментарий');
    }
  }
}
