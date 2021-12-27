import { Injectable } from '@nestjs/common';
import { News } from './news.interface';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: 1,
      title: 'Наша первая новость',
      description: 'Ураааа! Наша первая новость',
      author: 'Владислав',
      countView: 25,
    },
    {
      id: 2,
      title: 'Вторая новость',
      description: 'Вот так!',
      author: 'Олег',
      countView: 15,
    },
  ];

  find(id: number): News | undefined {
    return this.news.find((news) => news.id === id);
  }

  findAll(): News[] {
    return this.news;
  }

  create(news: News): News {
    const id = getRandomInt(0, 99999);
    const finalNews = {
      ...news,
      id: id,
    };

    this.news.push(finalNews);
    return finalNews;
  }

  remove(id: number): boolean {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }
    return false;
  }

  modify(id: number, news: News): News | undefined {
    const indexModifyNews = this.news.findIndex((news) => news.id === id);
    if (indexModifyNews !== -1) {
      Object.keys(news).forEach((key) => {
        if (key !== 'id') this.news[indexModifyNews][key] = news[key];
      });

      return this.news[indexModifyNews];
    }
    return undefined;
  }
}
