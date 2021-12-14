import { IsNotEmpty, IsString } from 'class-validator';

export class NewsIdDto {
  @IsString()
  @IsNotEmpty()
  newsId: string;
}

export class CommentBodyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CommentIdDto extends NewsIdDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;
}
