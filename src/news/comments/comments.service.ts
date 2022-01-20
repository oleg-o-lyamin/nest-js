import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
  ) {}

  async create(comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async createComment(
    idNews: number,
    message: string,
    idUser: number,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(idNews);
    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.userService.findById(idUser);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const commentEntity = new CommentsEntity();
    commentEntity.news = _news;
    commentEntity.user = _user;
    commentEntity.message = message;

    return this.commentsRepository.save(commentEntity);
  }

  async findById(id: number): Promise<CommentsEntity> {
    return await this.commentsRepository.findOne({
      where: { id: id },
      relations: ['user', 'news', 'news.user'],
    });
  }

  async delete(id: number) {
    await this.commentsRepository.delete(id);
  }

  async update(id: number, message: string) {
    return await this.commentsRepository.update(id, {
      message: message,
    });
  }

  async findByNewsId(id: number): Promise<CommentsEntity[]> {
    return await this.commentsRepository.find({
      where: { news: { id: id } },
      relations: ['user'],
    });
  }
}
