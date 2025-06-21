import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from '../entities/guide.entity';

@Injectable()
export class GuidesService {
  constructor(
    @InjectRepository(Guide)
    private readonly repo: Repository<Guide>,
  ) {}

  getAll() {
    return this.repo.find({ order: { updatedAt: 'DESC' } });
  }

  async getById(id: number) {
    const guide = await this.repo.findOne({ where: { id } });
    if (!guide) throw new NotFoundException('Инструкция не найдена');
    return guide;
  }

  create(data: { title: string; content: string; fileUrl?: string }) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: number, data: { title?: string; content?: string; fileUrl?: string }) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    await this.repo.delete(id);
    return { message: 'deleted' };
  }
}
