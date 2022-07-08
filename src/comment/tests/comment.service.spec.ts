import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentService } from '../comment.service';
import { Comment } from '../entities/comment.entity';
import { CommentCreateInput } from '../dto/comment-create.dto';
import { CommentUpdateInput } from '../dto/comment-update.dto';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { commentMock } from '../../../test/mocks/comment.mock';
import { postMock } from '../../../test/mocks/post.mock';
import { userMock } from '../../../test/mocks/user.mock';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  const COMMENT_REPOSITORY_TOKEN = getRepositoryToken(Comment);
  const POST_REPOSITORY_TOKEN = getRepositoryToken(Post);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const commentRepositoryMock = {
    create: jest.fn(() => commentMock),
    save: jest.fn((comment) => comment),
    findOne: jest.fn(() => commentMock),
    delete: jest.fn(() => ({
      affected: 1,
      raw: {},
    })),
  };

  const postRepositoryMock = {
    findOne: jest.fn(() => postMock),
  };

  const userRepositoryMock = {
    findOne: jest.fn(() => userMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: COMMENT_REPOSITORY_TOKEN,
          useValue: commentRepositoryMock,
        },
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

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(
      COMMENT_REPOSITORY_TOKEN,
    );
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(commentRepository).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create Comment', () => {
    it('should return created comment', async () => {
      const postId = 'POSTID';
      const authorId = 'USERID';
      const input: CommentCreateInput = {
        text: 'New Comment',
      };

      const result = await service.create(postId, authorId, input);

      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
      });
      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: authorId },
      });
      expect(commentRepositoryMock.create).toBeCalledWith(input);

      expect(commentRepositoryMock.save).toBeCalledWith({
        ...commentMock,
        post: postMock,
        author: userMock,
      });

      expect(result.comment).toEqual({
        ...commentMock,
        post: postMock,
        author: userMock,
      });
    });

    it('should return created comment with wrong post id', async () => {
      const postId = 'POSTID';
      const authorId = 'USERID';
      const input: CommentCreateInput = {
        text: 'New Comment',
      };

      jest.spyOn(postRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.create(postId, authorId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
      });
    });

    it('should return created comment with wrong author id', async () => {
      const postId = 'POSTID';
      const authorId = 'USERID';
      const input: CommentCreateInput = {
        text: 'New Comment',
      };

      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.create(postId, authorId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postRepositoryMock.findOne).toBeCalledWith({
        where: { id: postId },
      });
      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: authorId },
      });
    });
  });

  describe('Update Comment', () => {
    it('should return updated comment', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';
      const input: CommentUpdateInput = {
        text: 'New Comment Update',
      };

      const result = await service.update(commentId, userId, input);

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
      });

      expect(commentRepositoryMock.save).toBeCalledWith({
        ...commentMock,
        ...input,
      });
      expect(result.comment).toEqual({
        ...commentMock,
        ...input,
      });
    });

    it('should return updated comment with wrong post id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';
      const input: CommentUpdateInput = {
        text: 'New Comment Update',
      };

      jest.spyOn(commentRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.update(commentId, userId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
      });
    });

    it('should return updated comment with wrong user id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'OTHER_USERID';
      const input: CommentUpdateInput = {
        text: 'New Comment Update',
      };

      try {
        await service.update(commentId, userId, input);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
      });
    });
  });

  describe('Delete Comment', () => {
    it('should return id of deleted comment', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      const result = await service.delete(commentId, userId);

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
      });

      expect(result.id).toEqual(commentId);
    });

    it('should return id of deleted comment with wrong comment id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      jest.spyOn(commentRepository, 'delete').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            affected: 0,
            raw: {},
          }),
        ),
      );

      const result = await service.delete(commentId, userId);

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
      });

      expect(result.id).toBeNull();
    });

    it('should return id of deleted comment with wrong user id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'OTHER_USERID';

      try {
        await service.delete(commentId, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
      });
    });
  });

  describe('Get Comment', () => {
    it('should return comment by id', async () => {
      const id = 'COMMENTID';

      const result = await service.getById(id);

      expect(commentRepositoryMock.findOne).toBeCalledWith({ where: { id } });
      expect(result).toEqual(commentMock);
      expect(result.id).toEqual(id);
    });
  });

  describe('Like Comment', () => {
    it('should return liked comment', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      jest.spyOn(commentRepository, 'save').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            ...commentMock,
            likes: [userMock],
            likesIds: [userId],
          }),
        ),
      );

      const result = await service.like(commentId, userId);

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
        relations: ['likes'],
      });
      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });

      expect(commentRepositoryMock.save).toBeCalledWith({
        ...commentMock,
        likes: [userMock],
      });
      expect(result.comment).toEqual({
        ...commentMock,
        likes: [userMock],
        likesIds: [userId],
      });
    });

    it('should return liked comment with wrong comment id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      jest.spyOn(commentRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.like(commentId, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
        relations: ['likes'],
      });
    });

    it('should return liked comment with wrong user id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.like(commentId, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
        relations: ['likes'],
      });
      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('Unlike Comment', () => {
    it('should return liked comment', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      jest.spyOn(commentRepository, 'findOne').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            ...commentMock,
            likes: [userMock],
            likesIds: [userId],
          }),
        ),
      );
      jest.spyOn(commentRepository, 'save').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            ...commentMock,
            likes: [],
            likesIds: [],
          }),
        ),
      );

      const result = await service.unlike(commentId, userId);

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
        relations: ['likes'],
      });
      expect(commentRepositoryMock.save).toBeCalledWith({
        ...commentMock,
        likes: [],
        likesIds: [userId],
      });

      expect(result.comment).toEqual({
        ...commentMock,
        likes: [],
        likesIds: [],
      });
    });

    it('should return unliked comment with wrong comment id', async () => {
      const commentId = 'COMMENTID';
      const userId = 'USERID';

      jest.spyOn(commentRepository, 'findOne').mockReturnValueOnce(null);

      try {
        await service.unlike(commentId, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentRepositoryMock.findOne).toBeCalledWith({
        where: { id: commentId },
        relations: ['likes'],
      });
    });
  });
});
