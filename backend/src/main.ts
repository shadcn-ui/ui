import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { AdminLogsGateway } from './admin/admin-logs.gateway';

async function bootstrap() {
  // Загружаем .env вручную, чтобы быть уверенным
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 👇 Подключаем Live-лог gateway
  const adminLogsGateway = app.get(AdminLogsGateway);

  // 👇 Оборачиваем console.log, чтобы дублировать в live-лог
  const origConsoleLog = console.log;
  console.log = (...args) => {
    origConsoleLog(...args);
    try {
      adminLogsGateway.sendLog(args.map(String).join(' '));
    } catch (e) {
      const error = e as Error; // ✅ Приведение типа
      console.error('❌ Ошибка отправки лога через WebSocket:', error.message);
    }
  };

  // Включаем хуки завершения работы приложения
  app.enableShutdownHooks();



  // Подключение cookie-парсера
  app.use(cookieParser());
  Logger.log('🍪 Подключен cookie-parser');

  // Создание папки uploads, если не существует
  const uploadsPath = join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      Logger.log(`📁 Папка uploads создана: ${uploadsPath}`);
    }
  } catch (err) {
    const error = err as Error; // ✅ Приведение типа
    console.error('❌ Не удалось создать папку uploads:', error.message);
  }

  // Подключение статики
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
  Logger.log(`📂 Доступ к файлам: http://localhost:${process.env.PORT || 3000}/uploads/...`);

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Настройка CORS
  const rawOrigins = process.env.FRONTEND_URL;
  const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map((url) => url.trim())
    : ['http://localhost:3001'];

  Logger.log('✅ Разрешённые источники CORS:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Cookie',
  });

  const port = process.env.PORT || 3000;

  try {
    await app.listen(port);
    Logger.log(`🚀 Сервер запущен: http://localhost:${port}`);
  } catch (error) {
    const err = error as Error; // ✅ Приведение типа
    console.error('🚫 Не удалось запустить сервер:', err.message);
    process.exit(1);
  }
}

bootstrap();
