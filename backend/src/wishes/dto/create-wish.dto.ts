import {
  IsString,
  IsUrl,
  IsNumber,
  MinLength,
  MaxLength,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  raised?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @IsOptional()
  @IsNumber()
  copied?: number;
}
