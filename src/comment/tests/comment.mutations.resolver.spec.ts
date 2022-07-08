import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { CommentService } from '../comment.service';
import { CommentMutationsResolver } from '../resolvers/comment.mutations.resolver';
import { CommentCreateArgs } from '../dto/comment-create.dto';
import { CommentUpdateArgs } from '../dto/comment-update.dto';
import { CommentDeleteArgs } from '../dto/comment-delete.dto';
import { CommentLikeArgs } from '../dto/comment-like.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { commentMock } from '../../../test/mocks/comment.mock';
import { jwtPayloadMock, userMock } from '../../../test/mocks/user.mock';

describe('CommentMutationsResolver', () => {
  let resolver: CommentMutationsResolver;
  let commentService: CommentService;

  const commentServiceMock = {
    create: jest.fn(() => ({ comment: commentMock })),
    update: jest.fn((_commentId, _userId, input) => ({
      comment: {
        ...commentMock,
        ...input,
      },
    })),
    delete: jest.fn((id) => ({ id })),
    like: jest.fn(() => ({
      comment: {
        ...commentMock,
        likes: [userMock],
        likesIds: [userMock.id],
      },
    })),
    unlike: jest.fn(() => ({
      comment: commentMock,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentMutationsResolver,
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CommentMutationsResolver>(CommentMutationsResolver);
    commentService = module.get<CommentService>(CommentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(commentService).toBeDefined();
  });

  describe('Create Comment', () => {
    it('should return created comment', async () => {
      const args: CommentCreateArgs = {
        postId: 'POSTID',
        input: {
          text: 'New Comment',
        },
      };

      const result = await resolver.createComment(jwtPayloadMock, args);

      expect(commentServiceMock.create).toBeCalledWith(
        args.postId,
        jwtPayloadMock.id,
        args.input,
      );
      expect(result.comment).toEqual(commentMock);
    });

    it('should return created comment with wrong post/author id', async () => {
      const args: CommentCreateArgs = {
        postId: 'POSTID',
        input: {
          text: 'New Comment',
        },
      };

      jest.spyOn(commentService, 'create').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.createComment(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentServiceMock.create).toBeCalledWith(
        args.postId,
        jwtPayloadMock.id,
        args.input,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        CommentMutationsResolver.prototype.createComment,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Update Comment', () => {
    it('should return updated comment', async () => {
      const args: CommentUpdateArgs = {
        commentId: 'COMMENTID',
        input: {
          text: 'New Comment Content',
        },
      };

      const result = await resolver.updateComment(jwtPayloadMock, args);

      expect(commentServiceMock.update).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
        args.input,
      );
      expect(result.comment).toEqual({
        ...commentMock,
        ...args.input,
      });
    });

    it('should return updated comment with wrong comment id', async () => {
      const args: CommentUpdateArgs = {
        commentId: 'COMMENTID',
        input: {
          text: 'New Comment Content',
        },
      };

      jest.spyOn(commentService, 'update').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.updateComment(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentServiceMock.update).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
        args.input,
      );
    });

    it('should return updated comment with wrong user id', async () => {
      const args: CommentUpdateArgs = {
        commentId: 'COMMENTID',
        input: {
          text: 'New Comment Content',
        },
      };

      jest.spyOn(commentService, 'update').mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      try {
        await resolver.updateComment(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(commentServiceMock.update).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
        args.input,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        CommentMutationsResolver.prototype.updateComment,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Delete Comment', () => {
    it('should return id of deleted comment', async () => {
      const args: CommentDeleteArgs = {
        commentId: 'COMMENTID',
      };

      const result = await resolver.deleteComment(jwtPayloadMock, args);

      expect(commentServiceMock.delete).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );
      expect(result.id).toEqual(args.commentId);
    });

    it('should return id of deleted comment with wrong comment id', async () => {
      const args: CommentDeleteArgs = {
        commentId: 'COMMENTID',
      };

      jest
        .spyOn(commentService, 'delete')
        .mockReturnValueOnce(new Promise((resolve) => resolve({ id: null })));

      const result = await resolver.deleteComment(jwtPayloadMock, args);

      expect(commentServiceMock.delete).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );
      expect(result.id).toBeNull();
    });

    it('should return id of deleted comment with wrong user id', async () => {
      const args: CommentDeleteArgs = {
        commentId: 'COMMENTID',
      };

      jest.spyOn(commentService, 'delete').mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      try {
        await resolver.deleteComment(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(commentServiceMock.delete).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        CommentMutationsResolver.prototype.deleteComment,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Like Comment', () => {
    it('should return liked comment', async () => {
      const args: CommentLikeArgs = {
        commentId: 'COMMENTID',
      };

      const result = await resolver.likeComment(jwtPayloadMock, args);

      expect(commentServiceMock.like).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );

      expect(result.comment).toEqual({
        ...commentMock,
        likes: [userMock],
        likesIds: [jwtPayloadMock.id],
      });
    });

    it('should return liked comment with wrong commet/user id', async () => {
      const args: CommentLikeArgs = {
        commentId: 'COMMENTID',
      };

      jest.spyOn(commentService, 'like').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.likeComment(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentServiceMock.like).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        CommentMutationsResolver.prototype.likeComment,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Unlike Comment', () => {
    it('should return unliked comment', async () => {
      const args: CommentLikeArgs = {
        commentId: 'COMMENTID',
      };

      const result = await resolver.unlikeComment(jwtPayloadMock, args);

      expect(commentServiceMock.unlike).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );

      expect(result.comment).toEqual(commentMock);
    });

    it('should return liked comment with wrong commet/user id', async () => {
      const args: CommentLikeArgs = {
        commentId: 'COMMENTID',
      };

      jest.spyOn(commentService, 'unlike').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.unlikeComment(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(commentServiceMock.unlike).toBeCalledWith(
        args.commentId,
        jwtPayloadMock.id,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        CommentMutationsResolver.prototype.unlikeComment,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });
});
