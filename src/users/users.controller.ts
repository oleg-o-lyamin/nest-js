import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserFullProfileDto, UserPersonalInfoDto } from './dtos/dto';
import { from, Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFiledLoader';
import { hash } from 'src/utils/crypto';
import { AuthGuard } from '@nestjs/passport';

const avatarFileLoader = new HelperFileLoader();

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/new')
  @Render('new-user')
  new() {
    return { title: 'Создание нового пользователя' };
  }

  @Post('/new')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/avatars',
        filename: avatarFileLoader.customFileName,
      }),
      fileFilter: avatarFileLoader.fileFilter,
    }),
  )
  @Redirect()
  async create(
    @Body() body: UserFullProfileDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const userEntity = new UsersEntity();
    userEntity.firstName = body.firstName;
    userEntity.lastName = body.lastName;
    userEntity.email = body.email;
    userEntity.role = body.role;
    userEntity.avatar = '/avatars/' + avatar.filename;
    userEntity.password = await hash(body.password);
    this.usersService.create(userEntity);
    return { url: '/news' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/edit/:id')
  @Render('edit-user')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ title: string; user: UsersEntity }> {
    if (id != req.user.id) throw new UnauthorizedException();

    const user = await this.usersService.findById(id);
    return { title: 'Редактирование профиля', user: user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/edit/:id')
  @Redirect()
  async modify(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UserPersonalInfoDto,
    @Request() req,
  ) {
    if (id != req.user.id) throw new UnauthorizedException();

    await this.usersService.update(id, body);
    return { url: '/news' };
  }
}
