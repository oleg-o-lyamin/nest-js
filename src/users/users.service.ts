import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserPersonalInfoDto } from './dtos/dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) { }

  async create(userEntity: UsersEntity): Promise<UsersEntity | undefined> {
    return await this.usersRepository.save(userEntity);
  }

  async findById(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ id });
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async find(): Promise<UsersEntity[]> {
    return await this.usersRepository.find({});
  }

  async findByName(name: string): Promise<UsersEntity> {
    const parts = name.split(' ');
    return this.usersRepository.findOne({
      where: {
        firstName: parts[0],
        lastName: parts[1],
      },
    });
  }

  async update(id: number, body: UserPersonalInfoDto) {
    return await this.usersRepository.update(id, {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    });
  }
}
