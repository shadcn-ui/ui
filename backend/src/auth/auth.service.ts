import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'; // Заменено с bcrypt на bcryptjs
import { Response } from 'express';

function normalizeSnils(snils: string): string {
  return snils.replace(/\D/g, '');
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET is required (add to .env)');
    }
    this.jwtSecret = secret;
  }

  async validateUser(snils: string, password: string): Promise<any> {
    const cleanSnils = normalizeSnils(snils);
    const user = await this.usersService.findBySnilsWithPassword(cleanSnils);

    if (!user) {
      Logger.log(`[AuthService] Пользователь с СНИЛС ${cleanSnils} не найден`);
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Пароль не установлен, обратитесь к администратору.');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      Logger.log(`[AuthService] Неверный пароль для пользователя с СНИЛС ${cleanSnils}`);
      throw new UnauthorizedException('Неверный пароль');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async generateToken(user: any): Promise<{ token: string }> {
    const payload = {
      sub: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      position: user.position,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '4h',
    });

    return { token };
  }

  async login(user: any, res: Response) {
    const { token } = await this.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 4,
    });

    Logger.log(`[AuthService] Пользователь ${user.id} вошёл, токен установлен в cookie`);

    return {
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      message: 'Вход успешно выполнен',
      access_token: token,
    };
  }
}
