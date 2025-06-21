import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

// Получаем секрет из env и завершаем приложение, если его нет
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('❌ JWT_SECRET env переменная не указана! Завершение работы.');
  process.exit(1);
}

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
