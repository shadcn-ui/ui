import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  internalPhone?: string;

  @IsOptional()
  @IsString()
  position?: string;
}
