import { Express } from 'express';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as path from 'path';
import { NotificationService } from '../notifications/notification.service';
import { Role } from '../enums/user.enums';
import * as bcrypt from 'bcryptjs'; // Для хэширования паролей оборудования
import { NotificationType } from '../notifications/dto/create-notification.dto';
import axios from 'axios';

// ==========================
// Вспомогательная функция для Telegram-уведомлений
// ==========================
async function notifyTelegramGroup(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  if (!botToken || !groupChatId) return;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: groupChatId,
      text: message,
      parse_mode: 'Markdown',
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Ошибка отправки в Telegram:', (error as any).message);
    }
  }
}

type EquipmentInputDto = {
  inventoryNumber: string;
  name: string;
  type: string;
  macAddress?: string;
  ipAddress?: string;
  login?: string;
  password?: string;
  location: string;
  floor?: string;
  cabinet?: string;
  assignedToUserId?: number | null;
};

@Injectable()
export class EquipmentService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notifications: NotificationService,
  ) {}

  async getAll() {
    const equipment = await this.db.equipment.findMany({
      orderBy: { createdAt: 'desc' },
      relations: {
        assignedTo: true,
        assignedUsers: true,
        software: true,
      },
    });

    return equipment.map((e) => ({
      id: e.id,
      inventoryNumber: e.inventoryNumber,
      name: e.name,
      type: e.type,
      macAddress: e.macAddress,
      ipAddress: e.ipAddress,
      login: e.login,
      location: e.location,
      floor: e.floor,
      cabinet: e.cabinet,
      createdAt: e.createdAt,
      fileUrls: e.fileUrls,
      assignedTo: e.assignedTo
        ? {
            id: e.assignedTo.id,
            firstName: e.assignedTo.firstName,
            lastName: e.assignedTo.lastName,
            middleName: e.assignedTo.middleName,
            department: e.assignedTo.department,
          }
        : null,
      assignedUsers: e.assignedUsers?.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        middleName: u.middleName,
        department: u.department,
      })),
      software: e.software?.map((s) => ({
        id: s.id,
        name: s.name,
        version: s.version,
      })),
    }));
  }

  async findById(id: number) {
    const equipment = await this.db.equipment.findUnique({
      where: { id },
      relations: {
        assignedTo: true,
        assignedUsers: true,
        software: true,
      },
    });
    if (!equipment) throw new NotFoundException('Оборудование не найдено');

    return {
      id: equipment.id,
      inventoryNumber: equipment.inventoryNumber,
      name: equipment.name,
      type: equipment.type,
      macAddress: equipment.macAddress,
      ipAddress: equipment.ipAddress,
      login: equipment.login,
      location: equipment.location,
      floor: equipment.floor,
      cabinet: equipment.cabinet,
      createdAt: equipment.createdAt,
      fileUrls: equipment.fileUrls,
      assignedTo: equipment.assignedTo
        ? {
            id: equipment.assignedTo.id,
            firstName: equipment.assignedTo.firstName,
            lastName: equipment.assignedTo.lastName,
            middleName: equipment.assignedTo.middleName,
            department: equipment.assignedTo.department,
          }
        : null,
      assignedUsers: equipment.assignedUsers?.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        middleName: u.middleName,
        department: u.department,
      })),
      software: equipment.software?.map((s) => ({
        id: s.id,
        name: s.name,
        version: s.version,
      })),
    };
  }

  async create(data: EquipmentInputDto) {
    // Проверка уникальности inventoryNumber
    const existing = await this.db.equipment.findUnique({
      where: { inventoryNumber: data.inventoryNumber },
    });
    if (existing) {
      throw new ConflictException('Оборудование с таким инвентарным номером уже существует');
    }

    // Хэшируем пароль оборудования (если есть)
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const equipment = await this.db.equipment.create({
      data: {
        ...data,
        password: hashedPassword,
        assignedToUserId: data.assignedToUserId ?? null,
        assignedTo: data.assignedToUserId
          ? { id: data.assignedToUserId }
          : null,
        assignedUsers: data.assignedToUserId
          ? [{ id: data.assignedToUserId } as any]
          : [],
      },
    });

    // Оповещения (личные кабинеты)
    await this.notifications.create({
      role: Role.superuser,
      title: '🖥 Добавлено новое оборудование',
      message: `Оборудование "${equipment.name}" добавлено в систему.`,
      type: NotificationType.EQUIPMENT,
      url: `/admin/equipment`,
    });

    await this.notifications.create({
      role: Role.admin,
      title: '🖥 Добавлено новое оборудование',
      message: `Добавлено новое оборудование: "${equipment.name}".`,
      type: NotificationType.EQUIPMENT,
      url: `/admin/equipment`,
    });

    if (equipment.assignedToUserId) {
      const user = await this.db.user.findUnique({
        where: { id: equipment.assignedToUserId },
      });

      if (user) {
        await this.notifications.create({
          userId: user.id,
          title: '📦 Вам назначено оборудование',
          message: `Вам назначено оборудование "${equipment.name}".`,
          type: NotificationType.EQUIPMENT,
          url: `/dashboard/profile`,
        });
      }
    }

    // Уведомление в Telegram-группу
    await notifyTelegramGroup(
      `🖥 *Добавлено новое оборудование:*\n*${equipment.name}* (${equipment.type})\nИнв. №: ${equipment.inventoryNumber}`
    );

    // Не возвращаем password!
    const { password, ...safeEquipment } = equipment;
    return safeEquipment;
  }

  async update(id: number, data: Partial<EquipmentInputDto>) {
    const equipment = await this.db.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Оборудование не найдено');

    // Если меняется инвентарный номер — проверить уникальность
    if (data.inventoryNumber && data.inventoryNumber !== equipment.inventoryNumber) {
      const existing = await this.db.equipment.findUnique({
        where: { inventoryNumber: data.inventoryNumber },
      });
      if (existing) {
        throw new ConflictException('Оборудование с таким инвентарным номером уже существует');
      }
    }

    // Если обновляется пароль — хэшируем
    let updatedPassword: string | undefined;
    if (data.password) {
      updatedPassword = await bcrypt.hash(data.password, 10);
    }

    try {
      const updated = await this.db.equipment.update({
        where: { id },
        data: {
          ...data,
          ...(updatedPassword && { password: updatedPassword }),
          assignedToUserId: data.assignedToUserId ?? null,
          assignedTo: data.assignedToUserId
            ? { id: data.assignedToUserId }
            : null,
          assignedUsers: data.assignedToUserId
            ? [{ id: data.assignedToUserId } as any]
            : [],
        },
      });

      if (!updated) throw new NotFoundException('Оборудование не найдено');

      // Не возвращаем password!
      const { password, ...safeEquipment } = updated;
      return safeEquipment;
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при обновлении оборудования');
    }
  }

  async remove(id: number) {
    const equipment = await this.db.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Оборудование не найдено');
    try {
      await this.db.equipment.delete({
        where: { id },
      });
      return { message: 'Оборудование удалено' };
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при удалении оборудования');
    }
  }

  async attachFile(id: number, file: Express.Multer.File) {
    const equipment = await this.db.equipment.findUnique({
      where: { id },
      select: { fileUrls: true },
    });

    if (!equipment) {
      throw new NotFoundException('Оборудование не найдено');
    }

    const relativePath = path.relative(process.cwd(), file.path).replace(/\\/g, '/');
    const updatedFiles = [...(equipment.fileUrls || []), relativePath];

    return this.db.equipment.update({
      where: { id },
      data: {
        fileUrls: updatedFiles,
      },
    });
  }
}
