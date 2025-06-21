import {
    IsOptional,
    IsString,
    IsDateString,
    IsArray,
    IsNumber,
  } from 'class-validator';
  
  export class CreateSoftwareDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    version?: string;
  
    @IsOptional()
    @IsString()
    licenseKey?: string;
  
    @IsOptional()
    @IsString()
    licensedTo?: string;
  
    @IsOptional()
    @IsString()
    adminLogin?: string;
  
    @IsOptional()
    @IsString()
    adminPassword?: string;
  
    @IsOptional()
    @IsString()
    networkAddress?: string;
  
    @IsOptional()
    @IsString()
    installLocation?: string;
  
    @IsOptional()
    @IsDateString()
    purchaseDate?: string;
  
    @IsOptional()
    @IsDateString()
    supportStart?: string;
  
    @IsOptional()
    @IsDateString()
    supportEnd?: string;
  
    @IsOptional()
    @IsDateString()
    expiryDate?: string;
  
    @IsOptional()
    @IsArray()
    fileUrls?: string[];
  
    @IsOptional()
    @IsNumber()
    assignedUserId?: number;
  
    @IsOptional()
    @IsArray()
    equipmentIds?: number[];
  }
  