import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  UseGuards,
  Request,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersEntity } from 'src/users/users.entity';
import { CommentBodyDto } from '../dtos/dto';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/delete/:id')
  @Redirect()
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const news = (await this.commentsService.findById(id)).news;

    if (news.user.id != req.user.id) throw new UnauthorizedException();

    await this.commentsService.delete(id);
    return { url: `/news/${news.id}` };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/edit/:id')
  @Render('edit-comment')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ title: string; comment: CommentsEntity; user: UsersEntity }> {
    const comment = await this.commentsService.findById(id);

    if (comment.user.id != req.user.id) throw new UnauthorizedException();

    return {
      title: 'Редактирование комментария',
      comment: comment,
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/edit/:id')
  @Redirect()
  async modify(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CommentBodyDto,
    @Request() req,
  ) {
    const news = (await this.commentsService.findById(id)).news;

    if (news.user.id != req.user.id) throw new UnauthorizedException();

    await this.commentsService.update(id, body.message);
    return { url: `/news/${news.id}` };
  }
}
