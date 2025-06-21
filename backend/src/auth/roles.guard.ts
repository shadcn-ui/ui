import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // Если роль не требуется — пускаем
    }

    const request = context.switchToHttp().getRequest();
    // Используем id, как возвращаемый ключ из JwtStrategy
    const userId = request.user?.id;

    if (!userId) {
      this.logger.warn('Нет информации о пользователе в JWT');
      throw new ForbiddenException('Нет информации о пользователе');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.warn(`Пользователь не найден: userId=${userId}`);
      throw new ForbiddenException('Пользователь не найден');
    }

    // Логируем только в DEV, чтобы не светить роли в production
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(
        `Проверка прав: userId=${userId}, роль пользователя=${user.role}, требуется одна из: ${requiredRoles.join(', ')}`,
      );
    }

    if (!requiredRoles.includes(user.role)) {
      this.logger.warn(
        `Недостаточно прав: userId=${userId}, userRole=${user.role}, requiredRoles=${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
