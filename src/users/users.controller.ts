import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserCreateDto } from './dtos/dto';
import { from, Observable } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post()
  // async create(@Body() user: UserCreateDto): Promise<UsersEntity> {
  //   return this.usersService.create(user);
  // }

  @Get('/new')
  @Render('new-user')
  new() {
    return { title: 'Создание нового пользователя' };
  }

  @Post('/new')
  @Redirect()
  create(@Body() body: UserCreateDto) {
    this.usersService.create(body);
    return { url: '/users' };
  }

  @Get()
  @Render('new-user')
  async allUsers(): Promise<{ users: UsersEntity[] }> {
    const users: UsersEntity[] = await this.usersService.find();
    return { users: users };
  }
}
