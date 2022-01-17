import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role/role.enum';
import { hash } from 'src/utils/crypto';

import { Repository } from 'typeorm';
import { EditUserDto } from './dtos/dto';
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

  async update(id: number, body: EditUserDto) {
    const _user = await this.findById(id);

    return this.usersRepository.update(id, {
      firstName: body.firstName || _user.firstName,
      lastName: body.lastName || _user.lastName,
      email: body.email || _user.email,
      role: (body.role as Role) || _user.role,
      password: (await hash(body.password)) || _user.password,
    });
  }
}
