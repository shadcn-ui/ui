import { PartialType } from '@nestjs/mapped-types';
import { CreateSoftwareDto } from './create-software.dto';

export class UpdateSoftwareDto extends PartialType(CreateSoftwareDto) {}
