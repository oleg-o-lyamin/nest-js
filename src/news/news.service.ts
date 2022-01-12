import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { News } from './news.interface';
import { Comment } from './comments/comments.interface';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { NewsBodyDto } from './dtos/dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) { }

  async findById(id: number): Promise<NewsEntity> {
    return await this.newsRepository.findOne({
      where: { id: id },
      relations: ['user', 'comments', 'comments.user'],
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

  async update(id: number, body: NewsBodyDto) {
    return await this.newsRepository.update(id, {
      title: body.title,
      description: body.description,
    });
  }

  async delete(id: number) {
    await this.newsRepository.delete(id);
  }
}
