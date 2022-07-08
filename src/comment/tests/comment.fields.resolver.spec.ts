import { Test, TestingModule } from '@nestjs/testing';

import { CommentFieldsResolver } from '../resolvers/comment.fields.resolver';
import { UserService } from '../../user/user.service';
import { PostService } from '../../post/post.service';
import { userMock } from '../../../test/mocks/user.mock';
import { commentMock } from '../../../test/mocks/comment.mock';
import { postMock } from '../../../test/mocks/post.mock';

describe('CommentFieldsResolver', () => {
  let resolver: CommentFieldsResolver;
  let userService: UserService;
  let postService: PostService;

  const userServiceMock = {
    getById: jest.fn(() => userMock),
  };

  const postServiceMock = {
    getById: jest.fn(() => postMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentFieldsResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: PostService,
          useValue: postServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CommentFieldsResolver>(CommentFieldsResolver);
    userService = module.get<UserService>(UserService);
    postService = module.get<PostService>(PostService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
    expect(postService).toBeDefined();
  });

  describe('Author of Comment', () => {
    it('should return author of comment', async () => {
      const result = await resolver.author(commentMock);

      expect(userServiceMock.getById).toBeCalledWith(commentMock.authorId);
      expect(result).toEqual(userMock);
    });

    it('should return author of comment without author id', async () => {
      const result = await resolver.author({
        ...commentMock,
        authorId: null,
      });

      expect(userServiceMock.getById).toBeCalledTimes(0);
      expect(result).toBeNull();
    });

    it('should return author of comment with wrong author id', async () => {
      jest.spyOn(userService, 'getById').mockReturnValueOnce(null);

      const result = await resolver.author(commentMock);

      expect(userServiceMock.getById).toBeCalledWith(commentMock.authorId);
      expect(result).toBeNull();
    });
  });

  describe('Post of Comment', () => {
    it('should return post of comment', async () => {
      const result = await resolver.post(commentMock);

      expect(postServiceMock.getById).toBeCalledWith(commentMock.postId);
      expect(result).toEqual(postMock);
    });

    it('should return post of comment without post id', async () => {
      const result = await resolver.post({
        ...commentMock,
        postId: null,
      });

      expect(postServiceMock.getById).toBeCalledTimes(0);
      expect(result).toBeNull();
    });

    it('should return post of comment with wrong post id', async () => {
      jest.spyOn(postService, 'getById').mockReturnValueOnce(null);

      const result = await resolver.post(commentMock);

      expect(postServiceMock.getById).toBeCalledWith(commentMock.postId);
      expect(result).toBeNull();
    });
  });
});
