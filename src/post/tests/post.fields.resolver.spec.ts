import { Test, TestingModule } from '@nestjs/testing';

import { PostFieldsResolver } from '../resolvers/post.fields.resolver';
import { UserService } from '../../user/user.service';
import { CommentService } from '../../comment/comment.service';
import { CommentPaginationArgs } from '../../comment/dto/comment-pagination.dto';
import { postMock } from '../../../test/mocks/post.mock';
import { userMock } from '../../../test/mocks/user.mock';
import { commentMock } from '../../../test/mocks/comment.mock';

describe('PostFieldsResolver', () => {
  let resolver: PostFieldsResolver;
  let userService: UserService;
  let commentService: CommentService;

  const userServiceMock = {
    getById: jest.fn(() => userMock),
  };

  const commentServiceMock = {
    pagination: jest.fn(() => ({
      totalCount: 1,
      nodes: [commentMock],
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostFieldsResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<PostFieldsResolver>(PostFieldsResolver);
    userService = module.get<UserService>(UserService);
    commentService = module.get<CommentService>(CommentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
    expect(commentService).toBeDefined();
  });

  describe('Author of Post', () => {
    it('should return author of post', async () => {
      const result = await resolver.author(postMock);

      expect(userServiceMock.getById).toBeCalledWith(postMock.authorId);
      expect(result).toEqual(userMock);
    });

    it('should return author of post without author id', async () => {
      const result = await resolver.author({
        ...postMock,
        authorId: null,
      });

      expect(userServiceMock.getById).toBeCalledTimes(0);
      expect(result).toBeNull();
    });

    it('should return author of post with wrong author id', async () => {
      jest.spyOn(userService, 'getById').mockReturnValueOnce(null);

      const result = await resolver.author(postMock);

      expect(userServiceMock.getById).toBeCalledWith(postMock.authorId);
      expect(result).toBeNull();
    });
  });

  describe('Likes of Post', () => {
    it('should return number of likes of post', () => {
      const result = resolver.likes(postMock);

      expect(result).toEqual(expect.any(Number));
      expect(result === postMock.likesIds.length).toEqual(true);
    });
  });

  describe('Comments Pagination of Post', () => {
    it('should return comments pagination of post', async () => {
      const args: CommentPaginationArgs = {
        skip: 0,
        take: 10,
      };

      const result = await resolver.commentsPagination(postMock, args);

      expect(commentServiceMock.pagination).toBeCalledWith({
        ...args,
        where: {
          postId: postMock.id,
        },
      });

      expect(result.totalCount).toEqual(expect.any(Number));
      expect(result).toEqual({
        totalCount: 1,
        nodes: [commentMock],
      });
    });
  });
});
