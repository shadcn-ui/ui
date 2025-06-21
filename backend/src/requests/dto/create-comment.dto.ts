import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsString({ message: 'Текст комментария должен быть строкой' })
  @IsNotEmpty({ message: 'Текст комментария не может быть пустым' })
  text: string;

  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : Number(value)
  )
  @IsInt({ message: 'ID заявки должен быть числом' })
  requestId: number;

  // Если понадобится автор явно:
  // @IsOptional()
  // @Transform(({ value }) =>
  //   value === undefined || value === null || value === '' ? undefined : Number(value)
  // )
  // @IsInt({ message: 'ID автора должен быть числом' })
  // authorId?: number;
}
