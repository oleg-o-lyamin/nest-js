import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dtos/dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) { }

  async create(user: UserCreateDto): Promise<UsersEntity | undefined> {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.role = user.role;
    return await this.usersRepository.save(userEntity);
  }

  async findById(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ id });
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
}
