import { Post } from '../../src/post/entities/post.entity';

export const postMock: Post = {
  id: 'POSTID',
  createdAt: new Date('2022-01-01T01:00:00'),
  updatedAt: new Date('2022-01-01T01:00:00'),
  title: 'Post Title',
  description: null,
  author: null,
  authorId: 'USERID',
  likes: null,
  likesIds: [],
};
