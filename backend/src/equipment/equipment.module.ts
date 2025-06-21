import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from '../entities/equipment.entity';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from '../notifications/notification.module';
import { UsersModule } from '../users/users.module'; // <-- Добавили импорт UsersModule
import * as fs from 'fs';
import * as path from 'path';

// Гарантируем, что директория для загрузки файлов существует
const uploadPath = path.resolve('./uploads/equipment');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment]),
    MulterModule.register({
      dest: uploadPath,
    }),
    NotificationModule,
    forwardRef(() => UsersModule), // <-- Добавили UsersModule (в конец списка)
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService], // <-- Обычно good practice если используется в других модулях
})
export class EquipmentModule {}
