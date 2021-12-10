import { assignMetadata, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { CommentsController } from './comments/comments.controller';
import { News } from './news.interface';
import { Comment } from './comments/comments.interface';

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
      cover:
        'https://cdnn21.img.ria.ru/images/148839/96/1488399659_0:0:960:960_600x0_80_0_1_e38b72053fffa5d3d7e82d2fe116f0b3.jpg',
    },
    {
      id: 2,
      title: 'Вторая новость',
      description: 'Вот так!',
      author: 'Олег',
      countView: 15,
      cover:
        'https://www.performancedesigns.com/wp-content/uploads/2019/11/katana-3.jpg',
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

  addComment(id: number, content: string): boolean {
    const index = this.news.findIndex((news) => news.id == id);
    if (index !== -1) {
      this.news[index].comments = this.news[index].comments
        ? this.news[index].comments
        : [];

      this.news[index].comments.push({
        id: randomInt(0, 99999),
        message: content,
      });

      return true;
    } else return false;
  }

  addComment2(id: number, commentId: number, content: string): boolean {
    const index = this.news.findIndex((news) => news.id == id);
    if (index !== -1 && this.news[index].comments) {
      return this.addComment3(this.news[index].comments, commentId, content);
    } else return false;
  }

  addComment3(
    comments: Comment[],
    commentId: number,
    content: string,
  ): boolean {
    for (let index = 0; index < comments.length; index++) {
      if (comments[index].id == commentId) {
        comments[index].replies = comments[index].replies || [];
        comments[index].replies.push({
          id: randomInt(0, 99999),
          message: content,
        });
        return true;
      }

      if (comments[index].replies)
        if (this.addComment3(comments[index].replies, commentId, content))
          return true;
    }

    return false;
  }

  edit(id: number, commentId: number, content: string): boolean {
    const index = this.news.findIndex((news) => news.id == id);
    if (index !== -1 && this.news[index].comments) {
      return this.edit2(this.news[index].comments, commentId, content);
    } else return false;
  }

  edit2(comments: Comment[], commentId: number, content: string): boolean {
    for (let index = 0; index < comments.length; index++) {
      if (comments[index].id == commentId) {
        comments[index].message = content;
        return true;
      }

      if (comments[index].replies)
        if (this.edit2(comments[index].replies, commentId, content))
          return true;
    }

    return false;
  }

  delete(id: number, commentId: number): boolean {
    const index = this.news.findIndex((news) => news.id == id);
    if (index !== -1 && this.news[index].comments) {
      return this.delete2(this.news[index].comments, commentId);
    } else return false;
  }

  delete2(comments: Comment[], commentId: number): boolean {
    for (let index = 0; index < comments.length; index++) {
      if (comments[index].id == commentId) {
        comments.splice(index, 1);
        return true;
      }

      if (comments[index].replies)
        if (this.delete2(comments[index].replies, commentId)) return true;
    }

    return false;
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
