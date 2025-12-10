import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(dto: CreateWishlistDto) {
    const items = dto.items?.map((id) => ({ id })) || [];

    const wishlist = this.wishlistsRepository.create({
      ...dto,
      items,
    });

    return this.wishlistsRepository.save(wishlist);
  }

  findMany(query: FindOptionsWhere<Wishlist>) {
    return this.wishlistsRepository.find({ where: query });
  }

  findOne(query: FindOptionsWhere<Wishlist>) {
    return this.wishlistsRepository.findOne({ where: query });
  }

  async updateOne(query: FindOptionsWhere<Wishlist>, dto: UpdateWishlistDto) {
    const wishlist = await this.findOne(query);
    if (!wishlist) return null;
    Object.assign(wishlist, dto);
    return this.wishlistsRepository.save(wishlist);
  }

  async removeOne(query: FindOptionsWhere<Wishlist>) {
    const wishlist = await this.findOne(query);
    if (!wishlist) return null;
    return this.wishlistsRepository.remove(wishlist);
  }

  async updateWishlistSecure(
    userId: number,
    id: number,
    dto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne({ id });
    if (!wishlist) throw new Error('Wishlist not found');

    if (wishlist.owner.id !== userId) {
      throw new Error('Forbidden: not your wishlist');
    }

    return this.updateOne({ id }, dto);
  }

  async removeWishlistSecure(userId: number, id: number) {
    const wishlist = await this.findOne({ id });
    if (!wishlist) throw new Error('Wishlist not found');

    if (wishlist.owner.id !== userId) {
      throw new Error('Forbidden: not your wishlist');
    }

    return this.removeOne({ id });
  }
}
