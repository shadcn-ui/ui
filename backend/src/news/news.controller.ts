import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Пагинация через query: ?limit=10&offset=0
  @Get()
  async getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const off = offset ? parseInt(offset, 10) : 0;
    if (isNaN(lim) || isNaN(off)) {
      throw new BadRequestException('limit и offset должны быть числами');
    }
    return this.newsService.getAll({ limit: lim, offset: off });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Некорректный ID');
    }

    return this.newsService.getById(numericId);
  }

  @Post()
  @Roles('admin', 'moderator')
  async create(@Body() body: CreateNewsDto) {
    return this.newsService.create(body);
  }

  @Put(':id')
  @Roles('admin', 'moderator')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateNewsDto,
  ) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.newsService.update(numericId, body);
  }

  @Delete(':id')
  @Roles('admin', 'moderator')
  async delete(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.newsService.delete(numericId);
  }
}
