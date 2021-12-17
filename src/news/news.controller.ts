import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  HttpCode,
  Redirect,
  UploadedFile,
  UseInterceptors,
  Render,
} from '@nestjs/common';
import { News } from './news.interface';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { CommentIdDto, CommentBodyDto, NewsIdDto } from './dtos/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFiledLoader';
import { MailService } from 'src/mail/mail.service';

const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = '/avatars';

const SEND_TO = 'some.e.mail@something.com';

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private readonly commentsService: CommentsService,
    private mailService: MailService,
  ) {}

  @Get()
  @Render('news-list')
  getAllNewsView(): { title: string; news: News[] } {
    const news = this.newsService.findAll();
    return { title: 'Новости', news: news };
  }

  @Get('/:newsId/edit')
  @Render('news-edit')
  getEditView(@Param('newsId') id: string): { news: News } {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    return { news: news };
  }

  @Post('/:newsId/edit')
  @Redirect()
  editNews(@Param('newsId') id: string, @Body() body) {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const changes = [];
    Object.keys(body).forEach((key) => {
      if (news[key] != body[key])
        changes.push({ key: key, old: news[key], new: body[key] });
    });
    if (changes.length > 0) this.mailService.send(SEND_TO, changes);
    this.newsService.modify(idInt, body);
    return { url: `/news/${id}` };
  }

  @Get('/:id')
  @Render('news')
  getNewsView(@Param('id') id: string): { news: News } {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    return { news: news };
  }

  @Post('/:newsId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter,
    }),
  )
  @Redirect()
  addComment(
    @Param() params: NewsIdDto,
    @Body() comment: CommentBodyDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const idInt = parseInt(params.newsId);
    this.newsService.addComment(
      idInt,
      comment.content,
      '/avatars/' + avatar.filename,
    );
    return { url: `/news/${params.newsId}` };
  }

  @Post('/:newsId/new/:commentId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
      fileFilter: helperFileLoader.fileFilter,
    }),
  )
  @Redirect()
  addComment2(
    @Param() params: CommentIdDto,
    @Body() comment: CommentBodyDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const newsIdInt = parseInt(params.newsId);
    const commentIdInt = parseInt(params.commentId);
    this.newsService.addComment2(
      newsIdInt,
      commentIdInt,
      comment.content,
      '/avatars/' + avatar.filename,
    );
    return { url: `/news/${params.newsId}` };
  }

  @Post('/:newsId/edit/:commentId')
  @Redirect()
  edit(@Param() params: CommentIdDto, @Body() comment: CommentBodyDto) {
    const newsIdInt = parseInt(params.newsId);
    const commentIdInt = parseInt(params.commentId);
    this.newsService.edit(newsIdInt, commentIdInt, comment.content);
    return { url: `/news/${params.newsId}` };
  }

  @Post('/:newsId/delete/:commentId')
  @Redirect()
  deleteComment(@Param() params: CommentIdDto) {
    const newsIdInt = parseInt(params.newsId);
    const commentIdInt = parseInt(params.commentId);
    this.newsService.delete(newsIdInt, commentIdInt);
    return { url: `/news/${params.newsId}` };
  }

  @Get('/api')
  @HttpCode(200)
  getAllNews(): News[] {
    return this.newsService.findAll();
  }

  @Get('/api/:id')
  getNews(@Param('id') id: string): News {
    const idInt = parseInt(id);
    return this.newsService.find(idInt);
  }

  @Post('/api')
  create(@Body() news: News) {
    return this.newsService.create(news);
  }

  @Delete('/api/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Новость удалена' : 'Передан неверный идентификатор';
  }

  @Patch('/api/:id')
  modify(@Body() news: News, @Param('id') id: string): News | string {
    const idInt = parseInt(id);
    return (
      this.newsService.modify(idInt, news) || 'Передан неверный идентификатор'
    );
  }
}
