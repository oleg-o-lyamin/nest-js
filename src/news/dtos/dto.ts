import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class NewsCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  user: string;
}
