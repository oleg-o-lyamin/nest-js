import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { News } from './news.interface';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) { }

  @Get()
  @HttpCode(200)
  getAllNews(): News[] {
    return this.newsService.findAll();
  }

  @Get('/:id')
  getNews(@Param('id') id: string): News {
    const idInt = parseInt(id);
    return this.newsService.find(idInt);
  }

  @Post()
  create(@Body() news: News) {
    return this.newsService.create(news);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Новость удалена' : 'Передан неверный идентификатор';
  }

  @Patch('/:id')
  modify(@Body() news: News, @Param('id') id: string): News | string {
    const idInt = parseInt(id);
    return (
      this.newsService.modify(idInt, news) || 'Передан неверный идентификатор'
    );
  }
}
