import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OffersService } from './offers.service';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { FindOfferQueryDto } from './dto/find-offer-query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Offer } from './entities/offer.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async create(@Body() dto: CreateOfferDto, @Request() req) {
    return this.offersService.createSecure(req.user.userId, dto);
  }

  @Get()
  async findMany(@Query() query: FindOfferQueryDto) {
  const where: FindOptionsWhere<Offer> = {};

  if (query.userId !== undefined) {
    where.user = { id: query.userId };
  }

  if (query.itemId !== undefined) {
    where.item = { id: query.itemId };
  }

  return this.offersService.findMany(where);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const offer = await this.offersService.findOne({ id });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }
}
