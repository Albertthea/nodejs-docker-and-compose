import {
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  items?: number[];
}
