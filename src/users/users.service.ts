import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(user: UserCreateDto): Promise<User> {
    const newUser = this.userRepo.create(user);
    await this.userRepo.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepo.findOne({ username });
  }

  async findUserForAuth(username: string): Promise<User> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.username) = LOWER(:username)', { username })
      .getOne();
  }

  async update(id: string, user): Promise<User> {
    const currentUser = await this.userRepo.findOne(id);
    if (!currentUser)
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
    await this.userRepo.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.userRepo.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
