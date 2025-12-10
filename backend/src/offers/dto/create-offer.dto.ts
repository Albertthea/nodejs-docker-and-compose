import { IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
