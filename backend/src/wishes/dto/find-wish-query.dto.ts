import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FindWishQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ownerId?: number;
}
