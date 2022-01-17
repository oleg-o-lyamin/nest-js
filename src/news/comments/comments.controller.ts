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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { UsersEntity } from 'src/users/users.entity';
import { CommentBodyDto } from '../dtos/dto';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';
import { SocketCommentsGateway } from './socket-comments.gateway';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private gateway: SocketCommentsGateway,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  //@UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin)
  @Post('/delete/:id')
  @Redirect()
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comment = await this.commentsService.findById(id);

    this.eventEmitter.emit('comment.delete', {
      newsId: comment.news.id,
      id: id,
    });

    await this.commentsService.delete(id);
    return { url: `/news/${comment.news.id}` };
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
    const comment = await this.commentsService.findById(id);

    if (comment.user.id != req.user.id) throw new UnauthorizedException();

    this.eventEmitter.emit('comment.update', {
      commentId: comment.id,
      newsId: comment.news.id,
      message: body.message,
    });

    await this.commentsService.update(id, body.message);
    return { url: `/news/${comment.news.id}` };
  }
}
