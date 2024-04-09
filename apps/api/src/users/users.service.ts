import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async getMe(currentUser: User) {
    return this.userRepo.findOne({
      where: { id: currentUser.id },
      relations: ['company'],
    });
  }
}
