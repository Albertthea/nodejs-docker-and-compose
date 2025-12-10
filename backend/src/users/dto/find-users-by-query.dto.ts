import { IsString } from 'class-validator';

export class FindUsersByQueryDto {
  @IsString()
  query: string;
}
