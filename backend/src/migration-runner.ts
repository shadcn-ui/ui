import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from './entities/user.entity';
import { Equipment } from './entities/equipment.entity';
import { Request } from './entities/request.entity';
import { Comment } from './entities/comment.entity';
import { Notification } from './entities/notification.entity';
import { Software } from './entities/software.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ✅ Подключение через DATABASE_URL
  synchronize: false,
  logging: true,
  entities: [User, Equipment, Request, Comment, Notification, Software],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
});
