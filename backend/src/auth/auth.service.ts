import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne({ username });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
  
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    delete user.password;
    return user;
  }
}
