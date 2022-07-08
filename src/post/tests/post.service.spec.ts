import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostService } from '../post.service';
import { Post } from '../entities/post.entity';
import { PostCreateInput } from '../dto/post-create.dto';
import { PostUpdateInput } from '../dto/post-update.dto';
import { PostPaginationArgs } from '../dto/post-pagination.dto';
import { User } from '../../user/entities/user.entity';
import { SortDirection } from '../../pagination/pagination.dto';
import { userMock } from '../../../test/mocks/user.mock';
import { postMock } from '../../../test/mocks/post.mock';

describe('PostService', () => {
  let service: PostService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  const POST_REPOSITORY_TOKEN = getRepositoryToken(Post);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const postRepositoryMock = {
    create: jest.fn(() => postMock),
    save: jest.fn((post) => post),
    findOne: jest.fn(() => postMock),
    delete: jest.fn(() => ({
      affected: 1,
      raw: {},
    })),
    findAndCount: jest.fn(() => [[postMock], 1]),
  };

  const userRepositoryMock = {
    findOne: jest.fn(() => userMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: postRepositoryMock,
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create Post', () => {
    it('should return created post', async () => {
      const authorId = 'USERID';
      const input: PostCreateInput = {
        title: 'Post Title',
      };

      const result = await service.create(authorId, input);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: authorId },
      });
      expect(postRepositoryMock.create).toBeCalledWith(input);
      expect(postRepositoryMock.save).toBeCalledWith({
        ...postMock,
        author: userMock,
      });

      expect(result.post).toEqual({
        ...postMock,
        author: userMock,
      });
    });

    it('should return created post with wrong author id', async () => {
      const authorId = 'USERID';
      const input: PostCreateInput = {
        title: 'Post Title',
      };

      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.create(authorId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: authorId },
      });
    });
  });

  describe('Update Post', () => {
    it('should return updated post', async () => {
      const id = 'POSTID';
      const userId = 'USERID';
      const input: PostUpdateInput = {
        description: 'Post Description',
      };

      const result = await service.update(id, userId, input);

      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
      expect(postRepositoryMock.save).toBeCalledWith({
        ...postMock,
        ...input,
      });

      expect(result.post).toEqual({
        ...postMock,
        ...input,
      });
    });

    it('should return updated post with wrong post id', async () => {
      const id = 'POSTID';
      const userId = 'USERID';
      const input: PostUpdateInput = {
        description: 'Post Description',
      };

      jest.spyOn(postRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.update(id, userId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
    });

    it('should return updated post with wrong user id', async () => {
      const id = 'POSTID';
      const userId = 'OTHER_USERID';
      const input: PostUpdateInput = {
        description: 'Post Description',
      };

      try {
        await service.update(id, userId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
    });
  });

  describe('Delete Post', () => {
    it('should return id of deleted post', async () => {
      const id = 'POSTID';
      const userId = 'USERID';

      const result = await service.delete(id, userId);

      expect(postRepositoryMock.findOne).toBeCalledWith({ where: { id } });
      expect(postRepositoryMock.delete).toBeCalledWith(id);

      expect(result.id).toEqual(id);
    });

    it('should return id of deleted post with wrong post id', async () => {
      const id = 'POSTID';
      const userId = 'USERID';

      jest.spyOn(postRepository, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(postRepository, 'delete').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            affected: 0,
            raw: {},
          }),
        ),
      );

      const result = await service.delete(id, userId);

      expect(postRepositoryMock.findOne).toBeCalledWith({ where: { id } });
      expect(postRepositoryMock.delete).toBeCalledWith(id);

      expect(result.id).toBeNull();
    });

    it('should return id of deleted post with wrong user id', async () => {
      const id = 'POSTID';
      const userId = 'OTHER_USERID';

      try {
        await service.delete(id, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(postRepositoryMock.findOne).toBeCalledWith({ where: { id } });
    });
  });

  describe('Get Post', () => {
    it('should return post by id', async () => {
      const id = 'POSTID';

      const result = await service.getById(id);

      expect(postRepositoryMock.findOne).toBeCalledWith({ where: { id } });
      expect(result).toEqual(postMock);
    });
  });

  describe('Post Pagination', () => {
    it('should return post pagination', async () => {
      const args: PostPaginationArgs = {
        skip: 0,
        take: 10,
        sortBy: {
          title: SortDirection.ASC,
        },
      };

      const result = await service.pagination(args);

      expect(postRepositoryMock.findAndCount).toBeCalledWith({
        skip: args.skip,
        take: args.take,
        order: {
          title: 'ASC',
          createdAt: null,
        },
      });

      expect(result.totalCount).toEqual(expect.any(Number));
      expect(result).toEqual({
        nodes: [postMock],
        totalCount: 1,
      });
    });
  });

  describe('Like Post', () => {
    it('should return liked post', async () => {
      const userId = 'USERID';
      const postId = 'POSTID';

      jest.spyOn(postRepository, 'save').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            ...postMock,
            likes: [userMock],
            likesIds: [userId],
          }),
        ),
      );

      const result = await service.like(userId, postId);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
        relations: ['likes'],
      });
      expect(postRepositoryMock.save).toBeCalledWith({
        ...postMock,
        likes: [userMock],
      });

      expect(result.post).toEqual({
        ...postMock,
        likes: [userMock],
        likesIds: [userId],
      });
    });

    it('should return liked post with wrong user id', async () => {
      const userId = 'USERID';
      const postId = 'POSTID';

      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.like(userId, postId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
    });

    it('should return liked post with wrong post id', async () => {
      const userId = 'USERID';
      const postId = 'POSTID';

      jest.spyOn(postRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.like(userId, postId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
        relations: ['likes'],
      });
    });
  });

  describe('Unike Post', () => {
    it('should return unliked post', async () => {
      const userId = 'USERID';
      const postId = 'POSTID';

      jest.spyOn(postRepository, 'save').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            ...postMock,
            likes: [],
            likesIds: [],
          }),
        ),
      );

      const result = await service.unlike(userId, postId);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
        relations: ['likes'],
      });
      expect(postRepositoryMock.save).toBeCalledWith({
        ...postMock,
        likes: [],
      });

      expect(result.post).toEqual({
        ...postMock,
        likes: [],
        likesIds: [],
      });
    });

    it('should return unliked post with wrong user id', async () => {
      const userId = 'USERID';
      const postId = 'POSTID';

      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.unlike(userId, postId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
    });

    it('should return unliked post with wrong post id', async () => {
      const userId = 'USERID';
      const postId = 'POSTID';

      jest.spyOn(postRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.unlike(userId, postId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
        relations: ['likes'],
      });
    });
  });
});
