import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { instanceToPlain } from 'class-transformer';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  create(dto: CreateWishDto, owner: User) {
    const wish = this.wishesRepository.create({
      ...dto,
      owner,
    });
    return this.wishesRepository.save(wish);
  }

  findMany(query: FindOptionsWhere<Wish>) {
    return this.wishesRepository.find({ where: query });
  }

  findOne(query: FindOptionsWhere<Wish>) {
    return this.wishesRepository.findOne({
      where: query,
      relations: ['owner'],
    });
  }

  async findOneOrFail(query: FindOptionsWhere<Wish>) {
    const item = await this.wishesRepository.findOne({
      where: query,
      relations: [
        'owner',
        'offers',
        'owner.wishes',
        'owner.wishlists',
        'owner.offers',
      ],
    });
  
    if (!item) {
      throw new NotFoundException('Wish not found');
    }
    return instanceToPlain(item);
  }
  

  async updateOne(query: FindOptionsWhere<Wish>, dto: UpdateWishDto) {
    const wish = await this.findOne(query);
    if (!wish) return null;
    Object.assign(wish, dto);
    return this.wishesRepository.save(wish);
  }

  async removeOne(query: FindOptionsWhere<Wish>) {
    const wish = await this.findOne(query);
    if (!wish) return null;
    return this.wishesRepository.remove(wish);
  }

  async updateWishSecure(userId: number, id: number, dto: UpdateWishDto) {
    const wish = await this.findOneOrFail({ id });

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cannot edit someone else’s wish');
    }

    if ('price' in dto && wish.offers?.length) {
      throw new ForbiddenException('Cannot change price after offers made');
    }

    if ('raised' in dto) {
      throw new ForbiddenException('Raised is read-only and calculated');
    }

    return this.updateOne({ id }, dto);
  }

  async removeWishSecure(userId: number, id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
  
    if (!wish.owner || wish.owner.id !== userId) {
      throw new ForbiddenException('You cannot delete someone else’s wish');
    }
  
    return this.wishesRepository.remove(wish);
  }

  findTop() {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 12,
      relations: ['owner', 'offers'],
    });
  }
  
  findLast() {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  async copyWish(userId: number, wishId: number) {
    const original = await this.findOneOrFail({ id: wishId });
  
    original.copied = (original.copied || 0) + 1;
    await this.wishesRepository.save(original);
    const copy = this.wishesRepository.create({
      name: original.name,
      link: original.link,
      image: original.image,
      price: original.price,
      description: original.description,
      owner: { id: userId },
    });
  
    return this.wishesRepository.save(copy);
  }
}
