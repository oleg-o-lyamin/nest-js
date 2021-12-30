import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
  ) { }

  async create(comment: CommentsEntity) {
    return await this.commentsRepository.save(comment);
  }

  async findById(id: number): Promise<CommentsEntity> {
    return await this.commentsRepository.findOne({
      where: { id: id },
      relations: ['user', 'news'],
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
}
