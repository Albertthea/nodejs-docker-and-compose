import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsOptional()
  about?: string = 'Пока ничего не рассказал о себе';

  @IsString()
  @IsOptional()
  avatar?: string = 'https://i.pravatar.cc/300';

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
