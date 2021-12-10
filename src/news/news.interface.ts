import { Comment } from './comments/comments.interface';

export interface News {
  id?: number;
  title: string;
  description?: string;
  author?: string;
  countView?: number;
  cover?: string;
  comments?: Comment[];
}
