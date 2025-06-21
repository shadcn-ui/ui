import { Injectable } from '@nestjs/common';
import {
  DataSource,
  Repository,
  ObjectLiteral,
  FindOperator,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Between,
  Not,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Equipment } from '../entities/equipment.entity';
import { Request } from '../entities/request.entity';
import { News } from '../entities/news.entity';
import { Notification } from '../entities/notification.entity';
import { Comment } from '../entities/comment.entity';
import { Software } from '../entities/software.entity';
import { Guide } from '../entities/guide.entity';
import { RequestCategory } from '../entities/request-category.entity';
import { RequestPriority } from '../entities/request-priority.entity';

function transformCondition(value: any): any {
  if (value && typeof value === 'object' && !(value instanceof Date) && !(value instanceof FindOperator)) {
    if ('not' in value) {
      return Not(transformCondition(value.not));
    }

    const lower = value.gte ?? value.gt;
    const upper = value.lte ?? value.lt;
    if (lower !== undefined || upper !== undefined) {
      if (lower !== undefined && upper !== undefined) {
        return Between(lower, upper);
      }
      if (lower !== undefined) {
        return value.gte !== undefined ? MoreThanOrEqual(lower) : MoreThan(lower);
      }
      if (upper !== undefined) {
        return value.lte !== undefined ? LessThanOrEqual(upper) : LessThan(upper);
      }
    }

    const res: any = Array.isArray(value) ? [] : {};
    for (const [k, v] of Object.entries(value)) {
      res[k] = transformCondition(v);
    }
    return res;
  }
  return value;
}

function transformWhere(where: any): any {
  if (!where || typeof where !== 'object') return where;
  const res: any = Array.isArray(where) ? [] : {};
  for (const [k, v] of Object.entries(where)) {
    res[k] = transformCondition(v);
  }
  return res;
}

class RepoAdapter<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  findMany(opts?: any) {
    if (opts?.where) {
      opts.where = transformWhere(opts.where);
    }
    return this.repo.find(opts);
  }

  findUnique(opts: { where: any; select?: any; relations?: any; include?: any }) {
    return this.repo.findOne({
      where: transformWhere(opts.where),
      select: opts.select,
      relations: opts.relations,
    });
  }

  findFirst(opts: { where: any; select?: any; relations?: any; include?: any }) {
    return this.repo.findOne({
      where: transformWhere(opts.where),
      select: opts.select,
      relations: opts.relations,
    });
  }

  async create(opts: { data: any; include?: any }): Promise<T> {
    const entity = this.repo.create(opts.data as any);
    const saved = await this.repo.save(entity as any);
    return saved as T;
  }

  async update(opts: { where: any; data: any; include?: any }): Promise<T | null> {
    const where = transformWhere(opts.where);
    await this.repo.update(where, opts.data);
    return this.repo.findOne({ where });
  }

  delete(opts: { where: any }) {
    return this.repo.delete(transformWhere(opts.where));
  }

  count(opts?: { where?: any }) {
    return this.repo.count({ where: transformWhere(opts?.where) });
  }
}

class RequestRepoAdapter extends RepoAdapter<Request> {
  async groupBy(opts: { by: string[]; _count: true }) {
    const qb = this.repo.createQueryBuilder('r');
    qb.select([]); // reset default selections
    opts.by.forEach((field) => {
      qb.addSelect(`r.${field}`, field);
    });
    qb.addSelect('COUNT(*)', '_count');
    qb.groupBy(opts.by.map((f) => `r.${f}`).join(', '));
    const rows = await qb.getRawMany();
    return rows.map((row) => {
      const res: any = { _count: Number(row._count) };
      opts.by.forEach((f) => {
        res[f] = row[f];
      });
      return res;
    });
  }
}

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  get user() {
    return new RepoAdapter(this.dataSource.getRepository(User));
  }

  get equipment() {
    return new RepoAdapter(this.dataSource.getRepository(Equipment));
  }

  get request() {
    return new RequestRepoAdapter(this.dataSource.getRepository(Request));
  }

  get news() {
    return new RepoAdapter(this.dataSource.getRepository(News));
  }

  get notification() {
    return new RepoAdapter(this.dataSource.getRepository(Notification));
  }

  get comment() {
    return new RepoAdapter(this.dataSource.getRepository(Comment));
  }

  get software() {
    return new RepoAdapter(this.dataSource.getRepository(Software));
  }

  get guide() {
    return new RepoAdapter(this.dataSource.getRepository(Guide));
  }

  get requestCategory() {
    return new RepoAdapter(this.dataSource.getRepository(RequestCategory));
  }

  get requestPriority() {
    return new RepoAdapter(this.dataSource.getRepository(RequestPriority));
  }
}

