import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReferenceService {
  constructor(private readonly db: DatabaseService) {}

  getCategories() {
    return this.db.requestCategory.findMany({ orderBy: { name: 'asc' } });
  }

  getPriorities() {
    return this.db.requestPriority.findMany({ orderBy: { code: 'asc' } });
  }
}
