import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) { }

  @Post('/delete/:id')
  @Redirect()
  async delete(@Param('id') id: string) {
    const commentIdInt = parseInt(id);
    const newsId = (await this.commentsService.findById(commentIdInt)).news.id;
    await this.commentsService.delete(commentIdInt);
    return { url: `/news/${newsId}` };
  }

  @Get('/edit/:id')
  @Render('edit-comment')
  async edit(
    @Param('id') id: string,
  ): Promise<{ title: string; comment: CommentsEntity }> {
    const commentIdInt = parseInt(id);
    const comment = await this.commentsService.findById(commentIdInt);
    return { title: 'Редактирование комментария', comment: comment };
  }

  @Post('/edit/:id')
  @Redirect()
  async modify(@Param('id') id: string, @Body() body) {
    const commentIdInt = parseInt(id);
    await this.commentsService.update(commentIdInt, body.message);
    const newsId = (await this.commentsService.findById(commentIdInt)).news.id;
    return { url: `/news/${newsId}` };
  }
}
