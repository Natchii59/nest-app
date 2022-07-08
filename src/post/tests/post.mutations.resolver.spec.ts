import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PostService } from '../post.service';
import { PostMutationsResolver } from '../resolvers/post.mutations.resolver';
import { PostCreateInput } from '../dto/post-create.dto';
import { PostUpdateArgs } from '../dto/post-update.dto';
import { PostDeleteArgs } from '../dto/post-delete.dto';
import { PostLikeArgs } from '../dto/post-like.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { postMock } from '../../../test/mocks/post.mock';
import { jwtPayloadMock, userMock } from '../../../test/mocks/user.mock';

describe('PostMutationsResolver', () => {
  let resolver: PostMutationsResolver;
  let postService: PostService;

  const postServiceMock = {
    create: jest.fn(() => ({
      post: postMock,
    })),
    update: jest.fn((_postId, _userId, input) => ({
      post: {
        ...postMock,
        ...input,
      },
    })),
    delete: jest.fn((id) => ({ id })),
    like: jest.fn(() => ({
      post: {
        ...postMock,
        likes: [userMock],
        likesIds: ['USERID'],
      },
    })),
    unlike: jest.fn(() => ({
      post: postMock,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostMutationsResolver,
        {
          provide: PostService,
          useValue: postServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<PostMutationsResolver>(PostMutationsResolver);
    postService = module.get<PostService>(PostService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(postService).toBeDefined();
  });

  describe('Create Post', () => {
    it('should return created post', async () => {
      const input: PostCreateInput = {
        title: 'Post Title',
      };

      const result = await resolver.createPost(jwtPayloadMock, input);

      expect(postServiceMock.create).toBeCalledWith(jwtPayloadMock.id, input);
      expect(result.post).toEqual(postMock);
    });

    it('should return created post by wrong author id', async () => {
      const input: PostCreateInput = {
        title: 'Post Title',
      };

      jest.spyOn(postService, 'create').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.createPost(jwtPayloadMock, input);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postServiceMock.create).toBeCalledWith(jwtPayloadMock.id, input);
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        PostMutationsResolver.prototype.createPost,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Update Post', () => {
    it('should return updated post', async () => {
      const args: PostUpdateArgs = {
        id: 'POSTID',
        input: {
          description: 'Post Description',
        },
      };

      const result = await resolver.updatePost(jwtPayloadMock, args);

      expect(postServiceMock.update).toBeCalledWith(
        args.id,
        jwtPayloadMock.id,
        args.input,
      );
      expect(result.post).toEqual({
        ...postMock,
        ...args.input,
      });
    });

    it('should return updated post by wrong post id', async () => {
      const args: PostUpdateArgs = {
        id: 'POSTID',
        input: {
          description: 'Post Description',
        },
      };

      jest.spyOn(postService, 'update').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.updatePost(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postServiceMock.update).toBeCalledWith(
        args.id,
        jwtPayloadMock.id,
        args.input,
      );
    });

    it('should return updated post by wrong author id', async () => {
      const args: PostUpdateArgs = {
        id: 'POSTID',
        input: {
          description: 'Post Description',
        },
      };

      jest.spyOn(postService, 'update').mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      try {
        await resolver.updatePost(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(postServiceMock.update).toBeCalledWith(
        args.id,
        jwtPayloadMock.id,
        args.input,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        PostMutationsResolver.prototype.updatePost,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Delete Post', () => {
    it('should return id of deleted post', async () => {
      const args: PostDeleteArgs = {
        id: 'POSTID',
      };

      const result = await resolver.deletePost(jwtPayloadMock, args);

      expect(postServiceMock.delete).toBeCalledWith(args.id, jwtPayloadMock.id);
      expect(result.id).toEqual(args.id);
    });

    it('should return id of deleted post with wrong author', async () => {
      const args: PostDeleteArgs = {
        id: 'POSTID',
      };

      jest.spyOn(postService, 'delete').mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      try {
        await resolver.deletePost(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }

      expect(postServiceMock.delete).toBeCalledWith(args.id, jwtPayloadMock.id);
    });

    it('should return id of deleted post with wrong id', async () => {
      const args: PostDeleteArgs = {
        id: 'POSTID',
      };

      jest
        .spyOn(postService, 'delete')
        .mockReturnValueOnce(new Promise((resolve) => resolve({ id: null })));

      const result = await resolver.deletePost(jwtPayloadMock, args);

      expect(postServiceMock.delete).toBeCalledWith(args.id, jwtPayloadMock.id);
      expect(result.id).toBeNull();
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        PostMutationsResolver.prototype.deletePost,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Like Post', () => {
    it('should return liked post', async () => {
      const args: PostLikeArgs = {
        postId: 'POSTID',
      };

      const result = await resolver.likePost(jwtPayloadMock, args);

      expect(postServiceMock.like).toBeCalledWith(
        jwtPayloadMock.id,
        args.postId,
      );
      expect(result.post).toEqual({
        ...postMock,
        likes: [userMock],
        likesIds: ['USERID'],
      });
    });

    it('should return liked post with wrong user/post', async () => {
      const args: PostLikeArgs = {
        postId: 'POSTID',
      };

      jest.spyOn(postService, 'like').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.likePost(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postServiceMock.like).toBeCalledWith(
        jwtPayloadMock.id,
        args.postId,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        PostMutationsResolver.prototype.likePost,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Unlike Post', () => {
    it('should return unliked post', async () => {
      const args: PostLikeArgs = {
        postId: 'POSTID',
      };

      const result = await resolver.unlikePost(jwtPayloadMock, args);

      expect(postServiceMock.unlike).toBeCalledWith(
        jwtPayloadMock.id,
        args.postId,
      );
      expect(result.post).toEqual(postMock);
    });

    it('should return unliked post with wrong user/post', async () => {
      const args: PostLikeArgs = {
        postId: 'POSTID',
      };

      jest.spyOn(postService, 'unlike').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      try {
        await resolver.unlikePost(jwtPayloadMock, args);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(postServiceMock.unlike).toBeCalledWith(
        jwtPayloadMock.id,
        args.postId,
      );
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        PostMutationsResolver.prototype.unlikePost,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });
});
