import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('software')
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  // Пагинация: /software?limit=10&offset=0
  @Get()
  getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const off = offset ? parseInt(offset, 10) : 0;
    if (isNaN(lim) || isNaN(off)) {
      throw new NotFoundException('limit и offset должны быть числами');
    }
    return this.softwareService.getAll({ limit: lim, offset: off });
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const software = await this.softwareService.getById(id);
    if (!software) {
      throw new NotFoundException('ПО не найдено');
    }
    return software;
  }

  @Post()
  @Roles('admin')
  create(@Body() data: CreateSoftwareDto) {
    return this.softwareService.create(data);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSoftwareDto,
  ) {
    return this.softwareService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.softwareService.delete(id);
  }
}
