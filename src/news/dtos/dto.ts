import { IsNotEmpty, IsString } from 'class-validator';

export class CommentBodyDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
export class NewsBodyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
