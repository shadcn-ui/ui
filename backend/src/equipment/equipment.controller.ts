import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { EquipmentService } from './equipment.service';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import * as fs from 'fs';
import { Express } from 'express';
import { Roles } from '../auth/roles.decorator';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('equipment')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  findAll() {
    return this.equipmentService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findById(+id);
  }

  @Post()
  @Roles('admin')
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    // Temporary logging to diagnose validation issues
    console.log('Create equipment body:', createEquipmentDto);
    return this.equipmentService.create({
      ...createEquipmentDto,
      assignedToUserId: createEquipmentDto.assignedToUserId ?? null,
    });
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto
  ) {
    return this.equipmentService.update(
      +id,
      {
        ...updateEquipmentDto,
        assignedToUserId: updateEquipmentDto.assignedToUserId ?? null,
      } as Partial<UpdateEquipmentDto>
    );
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(+id);
  }

  @Post(':id/upload')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = resolve('./uploads/equipment');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Недопустимый тип файла'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 МБ
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    return this.equipmentService.attachFile(+id, file);
  }
}
