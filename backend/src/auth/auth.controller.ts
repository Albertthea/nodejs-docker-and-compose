import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
