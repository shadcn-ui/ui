// src/data-source.ts

import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from './entities/user.entity';
import { Equipment } from './entities/equipment.entity';
import { Request } from './entities/request.entity';
import { Comment } from './entities/comment.entity';
import { Notification } from './entities/notification.entity';
import { Software } from './entities/software.entity';
import { News } from './entities/news.entity';
import { Guide } from './entities/guide.entity';
import { RequestCategory } from './entities/request-category.entity';
import { RequestPriority } from './entities/request-priority.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,           // ✅ Использует переменную окружения
  schema: 'public',                         // ✅ Явно указываем схему
  synchronize: false,                       // ❗ Никогда не true в production
  logging: process.env.NODE_ENV !== 'production', // 🔍 В dev включено логирование
  entities: [
    User,
    Equipment,
    Request,
    Comment,
    Notification,
    Software,
    News,
    Guide,
    RequestCategory,
    RequestPriority,
  ],
  migrations: ['dist/migrations/*.js'],     // 🔁 Поддержка миграций после сборки
  subscribers: [],                          // 🔔 Если будут нужны события
});
