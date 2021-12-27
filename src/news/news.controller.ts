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
} from '@nestjs/common';
import { News } from './news.interface';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import {
  CommentIdDto,
  CommentBodyDto,
  NewsIdDto,
  NewsCreateDto,
} from './dtos/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFiledLoader';
import { MailService } from 'src/mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from 'src/users/users.entity';
import { CommentsEntity } from './comments/comments.entity';
import { RelationQueryBuilder } from 'typeorm';

const coverFileLoader = new HelperFileLoader();
coverFileLoader.path = '/covers';

const SEND_TO = 'some.e.mail@something.com';

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private commentsService: CommentsService,
    private mailService: MailService,
    private usersService: UsersService,
  ) { }

  @Post('/new')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: coverFileLoader.destinationPath,
        filename: coverFileLoader.customFileName,
      }),
      fileFilter: coverFileLoader.fileFilter,
    }),
  )
  @Redirect()
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    const _user = await this.usersService.findByName(news.user);
    if (!_user) {
      throw new HttpException('No such author!', HttpStatus.BAD_REQUEST);
    }

    if (!(cover && cover.filename && cover.filename.length > 0)) {
      throw new HttpException('No cover!', HttpStatus.BAD_REQUEST);
    }

    const _newsEntity = new NewsEntity();
    _newsEntity.cover = '/covers/' + cover.filename;
    _newsEntity.title = news.title;
    _newsEntity.description = news.description;
    _newsEntity.user = _user;
    await this.newsService.create(_newsEntity);
    return { url: '/news' };
  }

  @Get('/new')
  @Render('new-news')
  async new(): Promise<{ title: string; users: UsersEntity[] }> {
    return await this.usersService.find().then((data) => {
      return { title: 'Создание новой новости', users: data };
    });
  }

  @Get()
  @Render('news-list')
  async allNews(): Promise<{ title: string; news: NewsEntity[] }> {
    return await this.newsService.findAll().then((data) => {
      return { title: 'Новости', news: data };
    });
  }

  @Get('all/:id')
  @Render('news-list')
  async allNewsByAuthor(
    @Param('id') id: string,
  ): Promise<{ news: NewsEntity[] }> {
    const idInt = parseInt(id);
    return { news: await this.newsService.findAllByAuthor(idInt) };
  }

  @Get('/:id')
  @Render('view-news')
  async getNewsView(
    @Param('id') id: string,
  ): Promise<{ news: NewsEntity; users: UsersEntity[] }> {
    const idInt = parseInt(id);
    return {
      news: await this.newsService.findById(idInt),
      users: await this.usersService.find(),
    };
  }

  @Post('/:newsId')
  @Redirect()
  async addComment(
    @Param() params: NewsIdDto,
    @Body() comment: CommentBodyDto,
  ) {
    const idInt = parseInt(params.newsId);

    const commentEntity = new CommentsEntity();
    commentEntity.message = comment.content;
    commentEntity.user = await this.usersService.findByName(comment.user);
    commentEntity.news = await this.newsService.findById(idInt);
    await this.commentsService.create(commentEntity);
    return { url: `/news/${params.newsId}` };
  }

  @Get('/:newsId/edit')
  @Render('edit-news')
  async getEditView(
    @Param('newsId') id: string,
  ): Promise<{ title: string; news: NewsEntity }> {
    const idInt = parseInt(id);
    const news = await this.newsService.findById(idInt);
    return { title: 'Редактирование новости', news: news };
  }

  @Post('/:newsId/edit')
  @Redirect()
  async editNews(@Param('newsId') id: string, @Body() body) {
    const idInt = parseInt(id);
    await this.newsService.update(idInt, body.title, body.description);
    return { url: `/news/${id}` };
  }

  @Post('/:newsId/edit/:commentId')
  @Redirect()
  async edit(@Param() params: CommentIdDto, @Body() comment) {
    const commentIdInt = parseInt(params.commentId);
    await this.commentsService.update(commentIdInt, comment.content);
    return { url: `/news/${params.newsId}` };
  }

  @Post('/:newsId/delete/:commentId')
  @Redirect()
  async deleteComment(@Param() params: CommentIdDto) {
    const commentIdInt = parseInt(params.commentId);
    await this.commentsService.delete(commentIdInt);
    return { url: `/news/${params.newsId}` };
  }
}