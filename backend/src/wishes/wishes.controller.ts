import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Request,
  Delete,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('top')
  getTop() {
    return this.wishesService.findTop();
  }

  @Get('last')
  getLast() {
    return this.wishesService.findLast();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateWishDto, @Request() req: any) {
    const user = req.user as User;
    return this.wishesService.create(dto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.wishesService.findOneOrFail({ id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async secureUpdate(
    @Param('id') id: number,
    @Request() req,
    @Body() dto: UpdateWishDto,
  ) {
    try {
      return await this.wishesService.updateWishSecure(
        req.user.id,
        id,
        dto,
      );
    } catch (err) {
      if (err instanceof Error) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async secureDelete(@Param('id') id: number, @Request() req) {
    try {
      return await this.wishesService.removeWishSecure(req.user.id, id);
    } catch (err) {
      if (err instanceof Error) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Request() req) {
    return this.wishesService.copyWish(req.user.userId, id);
  }
}
