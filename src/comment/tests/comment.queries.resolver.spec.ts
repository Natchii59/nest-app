import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { CommentService } from '../comment.service';
import { CommentQueriesResolver } from '../resolvers/comment.queries.resolver';
import { CommentGetArgs } from '../dto/comment-get.dto';
import { CommentPaginationArgs } from '../dto/comment-pagination.dto';
import { commentMock } from '../../../test/mocks/comment.mock';

describe('CommentQueriesResolver', () => {
  let resolver: CommentQueriesResolver;
  let commentService: CommentService;

  const commentServiceMock = {
    getById: jest.fn(() => commentMock),
    pagination: jest.fn(() => ({
      totalCount: 1,
      nodes: [commentMock],
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentQueriesResolver,
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CommentQueriesResolver>(CommentQueriesResolver);
    commentService = module.get<CommentService>(CommentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(commentService).toBeDefined();
  });

  describe('Get Comment', () => {
    it('should return comment by id', async () => {
      const args: CommentGetArgs = {
        id: 'COMMENTID',
      };

      const result = await resolver.getCommentById(args);

      expect(commentServiceMock.getById).toBeCalledWith(args.id);
      expect(result.comment).toEqual(commentMock);
    });

    it('should return comment by wrong id', async () => {
      const args: CommentGetArgs = {
        id: 'COMMENTID',
      };

      jest.spyOn(commentService, 'getById').mockReturnValueOnce(null);

      try {
        await resolver.getCommentById(args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentServiceMock.getById).toBeCalledWith(args.id);
    });
  });

  describe('Comment Pagination', () => {
    it('should return pagination of comments', async () => {
      const args: CommentPaginationArgs = {
        skip: 0,
        take: 10,
      };

      const result = await resolver.commentPagination(args);

      expect(commentServiceMock.pagination).toBeCalledWith(args);

      expect(result.totalCount).toEqual(expect.any(Number));
      expect(result).toEqual({
        totalCount: 1,
        nodes: [commentMock],
      });
    });
  });
});
