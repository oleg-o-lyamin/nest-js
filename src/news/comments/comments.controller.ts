import { Body, Controller, Get, Param, Post, Redirect, Render, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersEntity } from 'src/users/users.entity';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('/delete/:id')
  @Redirect()
  async delete(@Param('id') id: string, @Request() req) {
    const commentIdInt = parseInt(id);
    const news = (await this.commentsService.findById(commentIdInt)).news;

    if (news.user.id != req.user.id) throw new UnauthorizedException();

    await this.commentsService.delete(commentIdInt);
    return { url: `/news/${news.id}` };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/edit/:id')
  @Render('edit-comment')
  async edit(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ title: string; comment: CommentsEntity; user: UsersEntity }> {
    const commentIdInt = parseInt(id);
    const comment = await this.commentsService.findById(commentIdInt);

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
  async modify(@Param('id') id: string, @Body() body, @Request() req) {
    const commentIdInt = parseInt(id);
    const news = (await this.commentsService.findById(commentIdInt)).news;
    console.log(news.user);
    console.log(req.user);
    if (news.user.id != req.user.id) throw new UnauthorizedException();

    await this.commentsService.update(commentIdInt, body.message);
    return { url: `/news/${news.id}` };
  }
}
