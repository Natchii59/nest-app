import { Test, TestingModule } from '@nestjs/testing';

import { PostService } from '../post.service';
import { PostGetArgs } from '../dto/post-get.dto';
import { postMock } from '../../../test/mocks/post.mock';

import { PostQueriesResolver } from '../resolvers/post.queries.resolver';
import { NotFoundException } from '@nestjs/common';
import { PostPaginationArgs } from '../dto/post-pagination.dto';

describe('PostQueriesResolver', () => {
  let resolver: PostQueriesResolver;
  let postService: PostService;

  const postServiceMock = {
    getById: jest.fn(() => postMock),
    pagination: jest.fn(() => ({
      totalCount: 1,
      nodes: [postMock],
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostQueriesResolver,
        {
          provide: PostService,
          useValue: postServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<PostQueriesResolver>(PostQueriesResolver);
    postService = module.get<PostService>(PostService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(postService).toBeDefined();
  });

  describe('Get Post', () => {
    it('should return post by id', async () => {
      const args: PostGetArgs = {
        id: 'POSTID',
      };

      const result = await resolver.getPostById(args);

      expect(postServiceMock.getById).toBeCalledWith(args.id);
      expect(result.post).toEqual(postMock);
    });

    it('should return post by wrong id', async () => {
      const args: PostGetArgs = {
        id: 'POSTID',
      };

      jest.spyOn(postService, 'getById').mockReturnValueOnce(null);

      try {
        await resolver.getPostById(args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postServiceMock.getById).toBeCalledWith(args.id);
    });
  });

  describe('Post Pagination', () => {
    it('should return post pagination', async () => {
      const args: PostPaginationArgs = {
        skip: 0,
        take: 10,
      };

      const result = await resolver.postPagination(args);

      expect(postServiceMock.pagination).toBeCalledWith(args);

      expect(result.totalCount).toEqual(expect.any(Number));
      expect(result).toEqual({
        totalCount: 1,
        nodes: [postMock],
      });
    });
  });
});
