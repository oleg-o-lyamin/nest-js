import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { News } from './news.interface';
import { Comment } from './comments/comments.interface';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) { }

  async findById(id: number): Promise<NewsEntity> {
    return await this.newsRepository.findOne({
      where: { id: id },
      relations: ['user', 'comments'],
    });
  }

  async findAll(): Promise<NewsEntity[]> {
    return await this.newsRepository.find({ relations: ['user'] });
  }

  async findAllByAuthor(id: number): Promise<NewsEntity[]> {
    return await this.newsRepository.find({
      where: { user: { id: id } },
      relations: ['user'],
    });
  }

  async create(news: NewsEntity) {
    return await this.newsRepository.save(news);
  }

  async update(id: number, title: string, description: string) {
    return await this.newsRepository.update(id, {
      title: title,
      description: description,
    });
  }

  // addComment(id: number, content: string, avatar: string): boolean {
  //   const index = this.news.findIndex((news) => news.id == id);
  //   if (index !== -1) {
  //     this.news[index].comments = this.news[index].comments
  //       ? this.news[index].comments
  //       : [];

  //     this.news[index].comments.push({
  //       id: randomInt(0, 99999),
  //       message: content,
  //       avatar: avatar,
  //     });

  //     return true;
  //   } else return false;
  // }

  // addComment2(
  //   id: number,
  //   commentId: number,
  //   content: string,
  //   avatar: string,
  // ): boolean {
  //   const index = this.news.findIndex((news) => news.id == id);
  //   if (index !== -1 && this.news[index].comments) {
  //     return this.addComment3(
  //       this.news[index].comments,
  //       commentId,
  //       content,
  //       avatar,
  //     );
  //   } else return false;
  // }

  // addComment3(
  //   comments: Comment[],
  //   commentId: number,
  //   content: string,
  //   avatar: string,
  // ): boolean {
  //   for (let index = 0; index < comments.length; index++) {
  //     if (comments[index].id == commentId) {
  //       comments[index].replies = comments[index].replies || [];
  //       comments[index].replies.push({
  //         id: randomInt(0, 99999),
  //         message: content,
  //         avatar: avatar,
  //       });
  //       return true;
  //     }

  //     if (comments[index].replies)
  //       if (
  //         this.addComment3(comments[index].replies, commentId, content, avatar)
  //       )
  //         return true;
  //   }

  //   return false;
  // }

  // edit(id: number, commentId: number, content: string): boolean {
  //   const index = this.news.findIndex((news) => news.id == id);
  //   if (index !== -1 && this.news[index].comments) {
  //     return this.edit2(this.news[index].comments, commentId, content);
  //   } else return false;
  // }

  // edit2(comments: Comment[], commentId: number, content: string): boolean {
  //   for (let index = 0; index < comments.length; index++) {
  //     if (comments[index].id == commentId) {
  //       comments[index].message = content;
  //       return true;
  //     }

  //     if (comments[index].replies)
  //       if (this.edit2(comments[index].replies, commentId, content))
  //         return true;
  //   }

  //   return false;
  // }

  // delete(id: number, commentId: number): boolean {
  //   const index = this.news.findIndex((news) => news.id == id);
  //   if (index !== -1 && this.news[index].comments) {
  //     return this.delete2(this.news[index].comments, commentId);
  //   } else return false;
  // }

  // delete2(comments: Comment[], commentId: number): boolean {
  //   for (let index = 0; index < comments.length; index++) {
  //     if (comments[index].id == commentId) {
  //       fs.unlinkSync(`public/${comments[index].avatar}`);
  //       comments.splice(index, 1);
  //       return true;
  //     }

  //     if (comments[index].replies)
  //       if (this.delete2(comments[index].replies, commentId)) return true;
  //   }

  //   return false;
  // }

  // // remove(id: number): boolean {
  // //   const indexRemoveNews = this.news.findIndex((news) => news.id === id);
  // //   if (indexRemoveNews !== -1) {
  // //     this.news.splice(indexRemoveNews, 1);
  // //     return true;
  // //   }
  // //   return false;
  // // }

  // async remove(id: number) {
  //   const _news = await this.findById(id);
  //   return await this.newsRepository.remove(_news);
  // }

  // modify(id: number, news: News): News | undefined {
  //   const indexModifyNews = this.news.findIndex((news) => news.id === id);
  //   if (indexModifyNews !== -1) {
  //     Object.keys(news).forEach((key) => {
  //       if (key !== 'id') this.news[indexModifyNews][key] = news[key];
  //     });

  //     return this.news[indexModifyNews];
  //   }
  //   return undefined;
  // }
}
