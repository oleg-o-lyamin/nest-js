import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
  Render,
  HttpException,
  HttpStatus,
  Req,
  Request,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { CommentBodyDto, NewsBodyDto } from './dtos/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFiledLoader';
import { MailService } from 'src/mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from 'src/users/users.entity';
import { CommentsEntity } from './comments/comments.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

const coverFileLoader = new HelperFileLoader();

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private commentsService: CommentsService,
    private mailService: MailService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/new')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './public/covers',
        filename: coverFileLoader.customFileName,
      }),
      fileFilter: coverFileLoader.fileFilter,
    }),
  )
  @Redirect()
  async create(
    @Body() news: NewsBodyDto,
    @UploadedFile() cover: Express.Multer.File,
    @Request() req,
  ) {
    if (!(cover && cover.filename && cover.filename.length > 0)) {
      throw new HttpException('No cover!', HttpStatus.BAD_REQUEST);
    }

    const _newsEntity = new NewsEntity();
    _newsEntity.cover = '/covers/' + cover.filename;
    _newsEntity.title = news.title;
    _newsEntity.description = news.description;
    _newsEntity.user = req.user;
    await this.newsService.create(_newsEntity);
    return { url: '/news' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/new')
  @Render('new-news')
  async new(@Request() req): Promise<{ title: string; user: UsersEntity }> {
    return await this.usersService.find().then((data) => {
      return { title: 'Создание новой новости', user: req.user };
    });
  }

  @Get()
  @Render('news-list')
  async allNews(@Request() req): Promise<{
    title: string;
    user: UsersEntity;
    news: NewsEntity[];
  }> {
    const user = await this.authService.verify(req.cookies.jwt);
    return await this.newsService.findAll().then((data) => {
      return { title: 'Новости', user: user, news: data };
    });
  }

  @Get('all/:id')
  @Render('news-list')
  async allNewsByAuthor(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ news: NewsEntity[]; user: UsersEntity }> {
    return {
      news: await this.newsService.findAllByAuthor(id),
      user: await this.authService.verify(req.cookies.jwt),
    };
  }

  @Get('/:id')
  @Render('view-news')
  async getNewsView(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ news: NewsEntity; user: UsersEntity }> {
    return {
      news: await this.newsService.findById(id),
      user: await this.authService.verify(req.cookies.jwt),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  @Redirect()
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() comment: CommentBodyDto,
    @Request() req,
  ) {
    const commentEntity = new CommentsEntity();
    commentEntity.message = comment.message;
    commentEntity.user = req.user;
    commentEntity.news = await this.newsService.findById(id);
    await this.commentsService.create(commentEntity);
    return { url: `/news/${id}` };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/edit/:id')
  @Render('edit-news')
  async getEditView(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ title: string; news: NewsEntity; user: UsersEntity }> {
    const news = await this.newsService.findById(id);

    if (news.user.id != req.user.id) throw new UnauthorizedException();

    return { title: 'Редактирование новости', news: news, user: news.user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/edit/:id')
  @Redirect()
  async editNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: NewsBodyDto,
    @Request() req,
  ) {
    const news = await this.newsService.findById(id);

    if (news.user.id != req.user.id) throw new UnauthorizedException();

    await this.newsService.update(id, body);
    return { url: `/news/${id}` };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/delete/:id')
  @Redirect()
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const news = await this.newsService.findById(id);

    if (news.user.id != req.user.id) throw new UnauthorizedException();

    await this.newsService.delete(id);
    return { url: '/news' };
  }

  //
  // API
  //

  @Get('api/all/:id')
  async allNewsByAuthorAPIMethod(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NewsEntity[]> {
    return await this.newsService.findAllByAuthor(id);
  }
}
