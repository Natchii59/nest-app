import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user.service';
import { UserQueriesResolver } from '../resolvers/user.queries.resolver';
import { UserGetArgs } from '../dto/user-get.dto';
import { UserPaginationArgs } from '../dto/user-pagination.dto';
import { userMock } from '../../../test/mocks/user.mock';

describe('UserQueriesResolver', () => {
  let resolver: UserQueriesResolver;
  let userService: UserService;

  const userServiceMock = {
    getById: jest.fn(() => userMock),
    pagination: jest.fn(() => ({
      totalCount: 1,
      nodes: [userMock],
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserQueriesResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UserQueriesResolver>(UserQueriesResolver);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Get User By Id', () => {
    it('should return user by id', async () => {
      const args: UserGetArgs = {
        id: 'test',
      };

      const result = await resolver.userGetById(args);

      expect(userServiceMock.getById).toBeCalledWith(args.id);
      expect(result.user).toEqual(userMock);
    });

    it('should return user by wrong id', async () => {
      jest.spyOn(userService, 'getById').mockReturnValueOnce(null);

      const args: UserGetArgs = {
        id: 'test',
      };

      try {
        await resolver.userGetById(args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(userServiceMock.getById).toBeCalledWith(args.id);
    });
  });

  describe('User Pagination', () => {
    it('should return pagination of users', async () => {
      const args: UserPaginationArgs = {
        skip: 0,
        take: 10,
      };

      const result = await resolver.userPagination(args);

      expect(userServiceMock.pagination).toBeCalledWith(args);
      expect(result).toEqual({
        totalCount: expect.any(Number),
        nodes: [userMock],
      });
    });
  });
});
