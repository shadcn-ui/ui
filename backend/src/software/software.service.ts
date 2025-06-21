import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notifications/notification.service';
import { Role } from '../enums/user.enums';
import { NotificationType } from '../notifications/dto/create-notification.dto';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import axios from 'axios';

// Telegram-группа уведомлений
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

@Injectable()
export class SoftwareService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notifications: NotificationService,
  ) {}

  async getAll(opts?: { limit?: number; offset?: number }) {
    const software = await this.db.software.findMany({
      relations: {
        users: true,
        equipment: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: opts?.offset ?? 0,
      take: opts?.limit ?? 10,
    });

    return software.map((s) => ({
      ...s,
      users: s.users?.map((u) => ({
        id: u.id,
        lastName: u.lastName,
        firstName: u.firstName,
        middleName: u.middleName,
        department: u.department,
      })),
      equipment: s.equipment?.map((e) => ({
        id: e.id,
        name: e.name,
        inventoryNumber: e.inventoryNumber,
        location: e.location,
        floor: e.floor,
        cabinet: e.cabinet,
      })),
    }));
  }

  async getById(id: number) {
    const software = await this.db.software.findUnique({
      where: { id },
      relations: {
        users: true,
        equipment: true,
      },
    });

    if (!software) {
      throw new NotFoundException('ПО не найдено');
    }

    return {
      ...software,
      users: software.users?.map((u) => ({
        id: u.id,
        lastName: u.lastName,
        firstName: u.firstName,
        middleName: u.middleName,
        department: u.department,
      })),
      equipment: software.equipment?.map((e) => ({
        id: e.id,
        name: e.name,
        inventoryNumber: e.inventoryNumber,
        location: e.location,
        floor: e.floor,
        cabinet: e.cabinet,
      })),
    };
  }

  /**
   * Создать ПО. Проверяется уникальность по названию + версии.
   */
  async create(data: CreateSoftwareDto) {
    // Проверка уникальности по названию и версии
    const exists = await this.db.software.findFirst({
      where: {
        name: data.name,
        version: data.version,
      },
    });
    if (exists) {
      throw new ConflictException('ПО с таким названием и версией уже существует');
    }

    // Преобразование дат
    const patchDates = (dto: any) => {
      for (const key of ['purchaseDate', 'supportStart', 'supportEnd', 'expiryDate']) {
        const val = dto[key];
        if (typeof val === 'string' && val.trim() !== '' && !isNaN(Date.parse(val))) {
          dto[key] = new Date(val);
        } else {
          dto[key] = null;
        }
      }
    };
    patchDates(data);

    const {
      assignedUserId,
      equipmentIds,
      fileUrls,
      ...softwareData
    } = data as any;

    delete softwareData.installLocation;

    const created = await this.db.software.create({
      data: {
        ...softwareData,
        users: assignedUserId
          ? { connect: { id: Number(assignedUserId) } }
          : undefined,
        equipment: Array.isArray(equipmentIds) && equipmentIds.length
          ? { connect: equipmentIds.map((id: number) => ({ id })) }
          : undefined,
        fileUrls: Array.isArray(fileUrls) ? fileUrls : [],
      },
    });

    // Оповещения
    await this.notifications.create({
      role: Role.superuser,
      title: '🧩 Добавлено новое ПО',
      message: `Программное обеспечение "${created.name}" добавлено.`,
      type: NotificationType.SOFTWARE,
      url: `/admin/software`,
    });

    await this.notifications.create({
      role: Role.admin,
      title: '🧩 Добавлено новое ПО',
      message: `Добавлено новое ПО: "${created.name}".`,
      type: NotificationType.SOFTWARE,
      url: `/admin/software`,
    });

    if (assignedUserId) {
      const user = await this.db.user.findUnique({
        where: { id: Number(assignedUserId) },
      });
      if (user) {
        await this.notifications.create({
          userId: user.id,
          title: '💾 Вам назначено ПО',
          message: `Вам назначено программное обеспечение "${created.name}".`,
          type: NotificationType.SOFTWARE,
          url: `/dashboard/profile`,
        });
      }
    }

    // Уведомление в Telegram-группу
    await notifyTelegramGroup(
      `🧩 *Добавлено новое программное обеспечение:*\n*${created.name}* (версия: ${created.version})`
    );

    return created;
  }

  async update(id: number, data: UpdateSoftwareDto) {
    // Проверка, что ПО есть
    const existing = await this.db.software.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('ПО не найдено');
    }

    // Преобразование дат
    const patchDates = (dto: any) => {
      for (const key of ['purchaseDate', 'supportStart', 'supportEnd', 'expiryDate']) {
        const val = dto[key];
        if (typeof val === 'string' && val.trim() !== '' && !isNaN(Date.parse(val))) {
          dto[key] = new Date(val);
        } else {
          dto[key] = null;
        }
      }
    };
    patchDates(data);

    const {
      assignedUserId,
      equipmentIds,
      fileUrls,
      ...softwareData
    } = data as any;

    delete softwareData.installLocation;

    return this.db.software.update({
      where: { id },
      data: {
        ...softwareData,
        users: assignedUserId
          ? { set: [{ id: Number(assignedUserId) }] }
          : { set: [] },
        equipment: Array.isArray(equipmentIds) && equipmentIds.length
          ? { set: equipmentIds.map((id: number) => ({ id })) }
          : { set: [] },
        fileUrls: Array.isArray(fileUrls) ? fileUrls : [],
      },
    });
  }

  async delete(id: number) {
    const existing = await this.db.software.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('ПО не найдено');
    }
    return this.db.software.delete({
      where: { id },
    });
  }
}
