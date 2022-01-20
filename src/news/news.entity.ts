import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'заголовок', description: 'заголовок новости' })
  @Column('text')
  title: string;

  @ApiProperty({ example: 'описание', description: 'описание новости' })
  @Column('text')
  description: string;

  @ApiProperty({
    example: '/public/covers/fdjsafldsjfld.jpg',
    description: 'путь к изображению',
  })
  @Column('text', { nullable: true })
  cover: string;

  @ApiProperty({ description: 'создатель новости', type: () => UsersEntity })
  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @ApiProperty({ description: 'комментарии новости' })
  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];

  @ApiProperty({
    example: '2015-09-01',
    description: 'дата создания новости',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2015-09-02',
    description: 'дата обновления новости',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
