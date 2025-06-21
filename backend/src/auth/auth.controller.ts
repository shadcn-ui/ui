import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto) {
    const birthDate = new Date(body.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('birthDate имеет неверный формат ISO-8601');
    }

    // Проверка уникальности snils уже есть в usersService.createUser
    const user = await this.usersService.createUser({
      ...body,
      birthDate,
    });

    return { message: 'Пользователь успешно зарегистрирован', user };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(body.snils, body.password);
      // AuthService сам ставит куку и возвращает объект ответа
      return await this.authService.login(user, res);
    } catch (error) {
      // Логирование для дебага
      console.error('[AuthController] Ошибка при логине:', error);
      // Выбрасываем ошибку дальше, Nest сам отправит корректный статус/текст
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Вы успешно вышли из системы' };
  }
}
