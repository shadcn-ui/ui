import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'superuser')
  getAll() {
    return this.usersService.getAllUsers();
  }

  @Post()
  @Roles('admin', 'superuser')
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.birthDate) {
      throw new BadRequestException('birthDate обязателен');
    }
    const userData = {
      ...createUserDto,
      birthDate: new Date(createUserDto.birthDate),
    };
    return this.usersService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    const user = req.user as any;
    const userId = user.id;
    if (user.role !== 'admin' && user.role !== 'superuser' && userId !== +id) {
      throw new ForbiddenException('Нет прав для обновления этого пользователя');
    }
    const updateData = {
      ...updateUserDto,
      ...(updateUserDto.birthDate ? { birthDate: new Date(updateUserDto.birthDate) } : {}),
    };
    return this.usersService.updateUserById(+id, updateData);
  }

  // ==== ДОБАВЬ ЭТО ДЛЯ УДАЛЕНИЯ ==== //
  @Delete(':id')
  @Roles('admin', 'superuser')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUserById(+id);
  }
  // ================================ //

  @Get('details/:id')
  @Roles('admin', 'superuser')
  getUserDetails(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user as any;
    const userId = user.id;
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  updateProfilePatch(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const userId = (req.user as any).id;
    return this.usersService.updateUserProfile(userId, dto);
  }

  @Put('update-profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = req.user as any;
    const userId = user.id;
    const updateData = {
      ...updateUserDto,
      ...(updateUserDto.birthDate ? { birthDate: new Date(updateUserDto.birthDate) } : {}),
    };
    return this.usersService.updateUser(userId, updateData);
  }
}
