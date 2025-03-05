export interface IComment {
  _id: string;
  content: string;
  section: string;
  post: string;
  user: string;
  name: string;
  website: string;
  email: string;
  parentComment: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  replies: IComment[];
}
