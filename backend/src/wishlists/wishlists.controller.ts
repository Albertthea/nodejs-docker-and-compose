import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() dto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create({
      ...dto,
      ownerId: req.user.userId,
    });
  }

  @Get()
  findAll() {
    return this.wishlistsService.findMany({});
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishlist = await this.wishlistsService.findOne({ id });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
    @Request() req,
  ) {
    const updated = await this.wishlistsService.updateWishlistSecure(
      req.user.userId,
      id,
      dto,
    );

    if (!updated) {
      throw new ForbiddenException('You are not allowed to update this wishlist');
    }

    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const removed = await this.wishlistsService.removeWishlistSecure(
      req.user.userId,
      id,
    );

    if (!removed) {
      throw new ForbiddenException('You are not allowed to delete this wishlist');
    }

    return removed;
  }
}
