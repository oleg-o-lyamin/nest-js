export type Comment = {
  id?: number;
  message: string;
  author?: string;
  replies?: Comment[];
  avatar?: string;
};
