import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private removePassword<T extends { password?: any }>(user: T): T {
    const copy = { ...user };
    delete copy.password;
    return copy;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    return this.removePassword(savedUser);
  }

  async findMany(query: FindOptionsWhere<User>) {
    const users = await this.usersRepository.find({ where: query });
    return users.map(this.removePassword);
  }

  async findOne(query: FindOptionsWhere<User>) {
    return this.usersRepository.findOne({
      where: query,
      select: ['id', 'username', 'email', 'about', 'avatar', 'password'],
    });
  }

  async updateOne(query: FindOptionsWhere<User>, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: query });
    if (!user) return null;

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);
    return this.removePassword(updated);
  }

  async removeOne(query: FindOptionsWhere<User>) {
    const user = await this.usersRepository.findOne({ where: query });
    if (!user) return null;

    await this.usersRepository.remove(user);
    return this.removePassword(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.removePassword(user);
    }
    return null;
  }

  async updateSecure(userId: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.updateOne({ id: userId }, dto);
  }

  async findManyByQuery(query: string) {
    const users = await this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
    return users.map(this.removePassword);
  }
}
