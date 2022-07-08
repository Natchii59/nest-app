import { Comment } from '../../src/comment/entities/comment.entity';

export const commentMock: Comment = {
  id: 'COMMENTID',
  createdAt: new Date('2022-01-01T01:00:00'),
  updatedAt: new Date('2022-01-01T01:00:00'),
  text: 'New Comment',
  author: null,
  authorId: 'USERID',
  likes: [],
  likesIds: [],
  post: null,
  postId: 'POSTID',
};
