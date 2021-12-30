import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([CommentsEntity])],
})
export class CommentsModule {}
