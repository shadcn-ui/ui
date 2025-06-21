import {
  IsString,
  IsOptional,
  IsMACAddress,
  IsIP,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEquipmentDto {
  @IsString()
  inventoryNumber: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsMACAddress()
  macAddress?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsIP()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  cabinet?: string;

  @IsOptional()
  @IsInt()
  assignedToUserId?: number | null;
}
