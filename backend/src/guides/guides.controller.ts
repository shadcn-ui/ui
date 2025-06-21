import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('guides')
export class GuidesController {
  constructor(private readonly guides: GuidesService) {}

  @Get()
  getAll() {
    return this.guides.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.guides.getById(numericId);
  }

  @Post()
  @Roles('admin', 'superuser')
  create(@Body() dto: { title: string; content: string; fileUrl?: string }) {
    return this.guides.create(dto);
  }

  @Patch(':id')
  @Roles('admin', 'superuser')
  update(
    @Param('id') id: string,
    @Body() dto: { title?: string; content?: string; fileUrl?: string },
  ) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.guides.update(numericId, dto);
  }

  @Delete(':id')
  @Roles('admin', 'superuser')
  delete(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Некорректный ID');
    }
    return this.guides.delete(numericId);
  }
}
