import { Controller, Get } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller()
export class ReferenceController {
  constructor(private readonly service: ReferenceService) {}

  @Get('categories')
  getCategories() {
    return this.service.getCategories();
  }

  @Get('priorities')
  getPriorities() {
    return this.service.getPriorities();
  }
}
