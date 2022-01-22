import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { NewsEntity } from './news.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService, UsersService],
  imports: [
    CommentsModule,
    //MailModule,
    TypeOrmModule.forFeature([NewsEntity]),
    TypeOrmModule.forFeature([UsersEntity]),
    AuthModule,
  ],
  exports: [NewsService],
})
export class NewsModule {}
