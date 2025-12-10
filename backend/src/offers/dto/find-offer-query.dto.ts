import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FindOfferQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  itemId?: number;
}
