import { Test, TestingModule } from '@nestjs/testing';

import { PostFieldsResolver } from '../resolvers/post.fields.resolver';
import { UserService } from '../../user/user.service';
import { postMock } from '../../../test/mocks/post.mock';
import { userMock } from '../../../test/mocks/user.mock';

describe('PostFieldsResolver', () => {
  let resolver: PostFieldsResolver;
  let userService: UserService;

  const userServiceMock = {
    getById: jest.fn(() => userMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostFieldsResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<PostFieldsResolver>(PostFieldsResolver);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
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
});
