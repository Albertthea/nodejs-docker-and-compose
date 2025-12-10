import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async createSecure(userId: number, dto: CreateOfferDto) {
    const wish = await this.wishesService.findOne({ id: dto.itemId });
    if (!wish) {
      throw new HttpException('Gift not found', HttpStatus.NOT_FOUND);
    }

    if (wish.owner.id === userId) {
      throw new HttpException(
        'You cannot donate to your own gift',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (wish.raised >= wish.price) {
      throw new HttpException(
        'Gift is already fully funded',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.amount + wish.raised > wish.price) {
      throw new HttpException(
        'Offer exceeds gift price',
        HttpStatus.BAD_REQUEST,
      );
    }

    const offer = this.offersRepository.create({
      ...dto,
      user: { id: userId },
      hidden: dto.hidden ?? false,
    });
    await this.offersRepository.save(offer);

    wish.raised += dto.amount;
    await this.wishesService.updateOne({ id: wish.id }, { raised: wish.raised });

    return offer;
  }

  findMany(query: FindOptionsWhere<Offer>) {
    return this.offersRepository.find({ where: query });
  }

  findOne(query: FindOptionsWhere<Offer>) {
    return this.offersRepository.findOne({ where: query });
  }

  async updateOne(query: FindOptionsWhere<Offer>, dto: UpdateOfferDto) {
    const offer = await this.findOne(query);
    if (!offer) return null;
    Object.assign(offer, dto);
    return this.offersRepository.save(offer);
  }

  async removeOne(query: FindOptionsWhere<Offer>) {
    const offer = await this.findOne(query);
    if (!offer) return null;
    return this.offersRepository.remove(offer);
  }

  async updateOfferSecure(userId: number, id: number, dto: UpdateOfferDto) {
    const offer = await this.findOne({ id });
    if (!offer) throw new Error('Offer not found');

    if (offer.user.id !== userId) {
      throw new Error('Forbidden: not your offer');
    }

    return this.updateOne({ id }, dto);
  }

  async removeOfferSecure(userId: number, id: number) {
    const offer = await this.findOne({ id });
    if (!offer) throw new Error('Offer not found');

    if (offer.user.id !== userId) {
      throw new Error('Forbidden: not your offer');
    }

    return this.removeOne({ id });
  }
}
