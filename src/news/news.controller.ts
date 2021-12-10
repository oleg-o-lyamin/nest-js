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
} from '@nestjs/common';
import { News } from './news.interface';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { renderNewsAll } from '../views/news/news-all';
import { renderNews } from 'src/views/news/news';
import { renderTemplate } from '../views/template';

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private readonly commentsService: CommentsService,
  ) { }

  @Get()
  getAllNewsView() {
    const news = this.newsService.findAll();
    const content = renderNewsAll(news);
    return renderTemplate(content, {
      title: 'Список новостей',
      description: 'Самый крутые новости на свете!',
    });
  }

  @Get('/:id')
  getNewsView(@Param('id') id: string) {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const content = renderNews(news);
    return renderTemplate(content, {
      title: `${news.title}`,
      description: `${news.description}`,
    });
  }

  @Post('/:id')
  @Redirect()
  addComment(@Param('id') id: string, @Body() comment: { content: string }) {
    const idInt = parseInt(id);
    this.newsService.addComment(idInt, comment.content);
    return { url: `/news/${id}` };
  }

  @Post('/:newsId/new/:commentId')
  @Redirect()
  addComment2(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
    @Body() comment: { content: string },
  ) {
    const newsIdInt = parseInt(newsId);
    const commentIdInt = parseInt(commentId);
    this.newsService.addComment2(newsIdInt, commentIdInt, comment.content);
    return { url: `/news/${newsId}` };
  }

  @Post('/:newsId/edit/:commentId')
  @Redirect()
  edit(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
    @Body() comment: { content: string },
  ) {
    const newsIdInt = parseInt(newsId);
    const commentIdInt = parseInt(commentId);
    this.newsService.edit(newsIdInt, commentIdInt, comment.content);
    return { url: `/news/${newsId}` };
  }

  @Post('/:newsId/delete/:commentId')
  @Redirect()
  deleteComment(
    @Param('newsId') newsId: string,
    @Param('commentId') commentId: string,
  ) {
    const newsIdInt = parseInt(newsId);
    const commentIdInt = parseInt(commentId);
    this.newsService.delete(newsIdInt, commentIdInt);
    return { url: `/news/${newsId}` };
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
