import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  InternalServerErrorException,
  UploadedFiles,
  UseInterceptors,
  Logger,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import * as fs from 'fs';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

const uploadPath = resolve('./uploads');

function fileFilter(req, file, cb) {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new BadRequestException('Недопустимый тип файла'), false);
  }
  cb(null, true);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);

  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateRequestDto,
    @Request() req: any,
  ) {
    const actualUserId = req.user?.userId ?? req.user?.id;
    if (typeof actualUserId !== 'number') {
      throw new BadRequestException('Не удалось определить ID пользователя');
    }
    const fileUrls = Array.isArray(files) ? files.map((file) => `/uploads/${file.filename}`) : [];
    return this.requestsService.createWithFiles(dto, actualUserId, fileUrls);
  }

  @Get()
  @Roles('admin')
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const off = offset ? parseInt(offset, 10) : 0;
    if (isNaN(lim) || isNaN(off)) {
      throw new BadRequestException('limit и offset должны быть числами');
    }
    return this.requestsService.findAll({ limit: lim, offset: off });
  }

  @Get('mine')
  findMine(@Request() req: any) {
    const userId = req.user?.userId ?? req.user?.id;
    return this.requestsService.findByUser(userId);
  }

  @Get('assigned')
  findAssigned(@Request() req: any) {
    const executorId = req.user?.userId ?? req.user?.id;
    return this.requestsService.findByExecutor(executorId);
  }

  @Get('user/:id')
  @Roles('admin')
  async getRequestsByUser(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId) || userId <= 0) {
      throw new BadRequestException('Некорректный ID пользователя');
    }
    return this.requestsService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const requestId = Number(id);
    if (isNaN(requestId) || requestId <= 0) {
      throw new BadRequestException('Неверный ID заявки');
    }
    const userId = req.user?.userId ?? req.user?.id;
    const request = await this.requestsService.findOne(requestId);
    if (
      req.user.role !== 'admin' &&
      request.userId !== userId &&
      request.executorId !== userId
    ) {
      throw new ForbiddenException('Нет доступа к заявке');
    }
    return request;
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateRequestDto,
    @Request() req: any,
  ) {
    const requestId = Number(id);
    if (isNaN(requestId) || requestId <= 0) {
      throw new BadRequestException('Неверный ID заявки');
    }
    const userId = req.user?.userId ?? req.user?.id;
    const request = await this.requestsService.findOne(requestId);

    if (
      req.user.role !== 'admin' &&
      request.userId !== userId &&
      request.executorId !== userId
    ) {
      throw new ForbiddenException('Нет прав на изменение заявки');
    }

    let uploadedUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      uploadedUrls = files.map((file) => `/uploads/${file.filename}`);
    }

    const existingUrls: string[] = dto.fileUrls ?? [];
    const combinedFileUrls = [...existingUrls, ...uploadedUrls];

    const status = dto.status?.toUpperCase();

    if (status === 'DONE' || status === 'COMPLETED') {
      if (typeof dto.rating !== 'number' || dto.rating < 1 || dto.rating > 5) {
        throw new BadRequestException('Пожалуйста, поставьте оценку (от 1 до 5) при завершении заявки');
      }
      dto.feedback = (dto.feedback || '').trim();
    } else {
      delete dto.rating;
      delete dto.feedback;
    }

    return this.requestsService.update(requestId, {
      ...dto,
      fileUrls: combinedFileUrls,
    }, userId);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const requestId = Number(id);
    if (isNaN(requestId) || requestId <= 0) {
      throw new BadRequestException('Неверный ID заявки');
    }
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) {
      throw new BadRequestException('Не удалось определить пользователя');
    }
    const request = await this.requestsService.findOne(requestId);
    if (
      req.user.role !== 'admin' &&
      request.userId !== userId &&
      request.executorId !== userId
    ) {
      throw new ForbiddenException('Нет прав на комментирование');
    }
    if (!createCommentDto.text?.trim()) {
      throw new BadRequestException('Комментарий не может быть пустым');
    }
    try {
      return await this.requestsService.addComment(requestId, createCommentDto.text.trim(), userId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error('Ошибка при добавлении комментария', err.stack || err.message);
      } else {
        this.logger.error('Неизвестная ошибка при добавлении комментария', String(err));
      }
      throw new InternalServerErrorException('Не удалось добавить комментарий');
    }
  }
}
