import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FindUserQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
