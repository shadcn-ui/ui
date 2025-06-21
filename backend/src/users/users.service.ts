import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department, Role } from '../enums/user.enums';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/dto/create-notification.dto';
import { TelegramService } from '../telegram/telegram.service';
import axios from 'axios';

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const cleaned = digits.replace(/^8/, '7');
  return `+${cleaned}`;
}

function normalizeSnils(snils: string): string {
  return snils.replace(/\D/g, '');
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly notifications: NotificationService,
    private readonly telegram: TelegramService,
  ) {}

  private async notifyTelegramGroup(message: string): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
    if (!botToken || !groupChatId) return false;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id: groupChatId,
        text: message,
        parse_mode: 'Markdown',
      });
      return true;
    } catch (error) {
      this.logger.error(
        '❌ Ошибка отправки в Telegram',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }

  async getAllUsers() {
    return this.repo.find({
      order: { lastName: 'ASC' },
      relations: ['assignedEquipment', 'software'],
    });
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    password: string;
    birthDate: Date | string;
    snils: string;
    mobilePhone: string;
    internalPhone: string;
    position: string;
    department: Department;
    floor?: string;
    cabinet?: string;
    role?: Role;
  }) {
    const normSnils = normalizeSnils(data.snils);
    const userWithSameSnils = await this.findBySnilsWithPassword(normSnils);
    if (userWithSameSnils) {
      throw new HttpException(
        'Пользователь с таким СНИЛС уже существует',
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const normalizedPhone = normalizePhone(data.mobilePhone);
    const { password, birthDate, ...rest } = data;
    const birthDateValue: Date =
      typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    if (!birthDateValue || isNaN(birthDateValue.getTime())) {
      throw new HttpException(
        'birthDate обязателен и должен быть корректной датой',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const entity = this.repo.create({
        ...rest,
        snils: data.snils,
        mobilePhone: normalizedPhone,
        birthDate: birthDateValue,
        passwordHash,
        role: rest.role || Role.user,
      });
      const newUser = await this.repo.save(entity);

      await this.notifications.create({
        role: Role.superuser,
        title: '👤 Новый пользователь',
        message: `Пользователь ${newUser.lastName} ${newUser.firstName} зарегистрирован в системе.`,
        type: NotificationType.USER,
        url: `/admin/users`,
      });

      await this.notifyTelegramGroup(
        `👤 *Новый пользователь зарегистрирован!*\n${newUser.lastName} ${newUser.firstName} (${newUser.department})`
      );

      if (newUser.telegramUserId) {
        try {
          await this.telegram.sendMessage(
            newUser.telegramUserId.toString(),
            '🎉 Вы успешно зарегистрированы в системе.'
          );
        } catch (err) {
          this.logger.error(
            'Ошибка отправки приветственного сообщения',
            err instanceof Error ? err.stack : String(err)
          );
        }
      }

      return newUser;
    } catch (error) {
      this.logger.error(
        'Ошибка при создании пользователя',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async updateUserById(
    id: number,
    updateData: Partial<{
      firstName: string;
      lastName: string;
      middleName?: string;
      birthDate?: Date | string;
      snils?: string;
      mobilePhone?: string;
      internalPhone?: string;
      department?: Department;
      position?: string;
      role?: Role;
      floor?: string;
      cabinet?: string;
      assignedEquipmentId?: number;
      password?: string;
    }>,
  ) {
    if (updateData.mobilePhone) {
      updateData.mobilePhone = normalizePhone(updateData.mobilePhone);
    }
    if (updateData.birthDate && typeof updateData.birthDate === 'string') {
      updateData.birthDate = new Date(updateData.birthDate);
    }
    if (updateData.password && updateData.password.length >= 6) {
      updateData['passwordHash'] = await bcrypt.hash(updateData.password, 10);
    }
    delete updateData.password;

    await this.repo.update(id, updateData);
    return this.repo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        department: true,
        position: true,
        role: true,
        internalPhone: true,
        mobilePhone: true,
        snils: true,
        floor: true,
        cabinet: true,
        birthDate: true,
      },
    });
  }

  async updateUser(
    userId: number,
    updateData: Partial<{
      firstName: string;
      lastName: string;
      middleName?: string;
      department?: Department;
      position?: string;
      mobilePhone?: string;
      internalPhone?: string;
    }>,
  ) {
    if (updateData.mobilePhone) {
      updateData.mobilePhone = normalizePhone(updateData.mobilePhone);
    }
    await this.repo.update(userId, updateData);
    return this.repo.findOne({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        department: true,
        position: true,
        role: true,
        internalPhone: true,
        mobilePhone: true,
        snils: true,
        floor: true,
        cabinet: true,
        birthDate: true,
      },
    });
  }

  async updateUserProfile(
    userId: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      middleName?: string;
      position?: string;
      mobilePhone?: string;
      internalPhone?: string;
    }>,
  ) {
    try {
      return await this.updateUser(userId, data);
    } catch (error) {
      this.logger.error(
        'Ошибка обновления профиля пользователя',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Не удалось обновить профиль');
    }
  }

  async findById(userId: number) {
    return this.repo.findOne({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        department: true,
        position: true,
        mobilePhone: true,
        internalPhone: true,
        birthDate: true,
        snils: true,
        floor: true,
        cabinet: true,
      },
      relations: {
        assignedEquipment: true,
        software: true,
      },
    });
  }

  /**
   * Для авторизации: вернуть user с passwordHash!
   */
  async findBySnilsWithPassword(snils: string) {
    const onlyDigits = normalizeSnils(snils);
    return this.repo
      .createQueryBuilder('user')
      .where("regexp_replace(user.snils, '[^0-9]', '', 'g') = :snils", {
        snils: onlyDigits,
      })
      .getOne();
  }

  /**
   * Безопасный возврат: user без passwordHash.
   */
  async findBySnils(snils: string) {
    const user = await this.findBySnilsWithPassword(snils);
    if (!user)
      throw new NotFoundException('Пользователь с таким СНИЛС не найден');
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async deleteUserById(id: number) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      await this.repo.delete(id);
      return existing;
    } catch (error) {
      this.logger.error(
        'Ошибка при удалении пользователя',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findByNormalizedPhone(inputPhone: string) {
    const phone = normalizePhone(inputPhone);
    return this.repo.findOne({
      where: { mobilePhone: phone },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        department: true,
        position: true,
        role: true,
        internalPhone: true,
        mobilePhone: true,
        snils: true,
        floor: true,
        cabinet: true,
        birthDate: true,
      },
    });
  }
}
