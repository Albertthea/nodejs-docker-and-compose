import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { FindUserQueryDto } from './dto/find-user-query.dto';
import { FindUsersByQueryDto } from './dto/find-users-by-query.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findOne({ id: req.user.userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    delete user.password;
    return user;
  }

  @Patch('me')
  async updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateSecure(req.user.userId, dto);
    if (!updated) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    delete user.password;
    return user;
  }

  @Post('find')
  async search(@Body() dto: FindUsersByQueryDto) {
    if (!dto.query) {
      throw new BadRequestException('Query string is required');
    }

    const users = await this.usersService.findManyByQuery(dto.query);

    return users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }
}
