import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /** 아이디로 사용자 조회 */
async findByUserId(userid: string): Promise<User | null> {
  return this.usersRepository.findOne({ where: { userid } });
}

  /** 신규 사용자 생성 */
  async createUser(data: {
    userid: string;
    name: string;
    password: string;
    email: string;
    phone?: string;
    address?: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }
}
