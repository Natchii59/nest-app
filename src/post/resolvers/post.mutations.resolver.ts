import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JWTPayload } from 'src/auth/dto/jwt-payload.dto';
import { CurrentUser, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostCreateInput, PostCreateOuput } from '../dto/post-create.dto';
import { PostDeleteArgs, PostDeleteOutput } from '../dto/post-delete.dto';
import { PostLikeArgs, PostLikeOutput } from '../dto/post-like.dto';
import { PostUpdateArgs, PostUpdateOutput } from '../dto/post-update.dto';
import { Post } from '../entities/post.entity';
import { PostService } from '../post.service';

@Resolver(Post)
export class PostMutationsResolver {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostCreateOuput)
  async createPost(
    @CurrentUser() user: JWTPayload,
    @Args('input') input: PostCreateInput,
  ): Promise<PostCreateOuput> {
    return await this.postService.create(user.id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostUpdateOutput)
  async updatePost(
    @CurrentUser() user: JWTPayload,
    @Args() args: PostUpdateArgs,
  ): Promise<PostUpdateOutput> {
    return await this.postService.update(args.id, user.id, args.input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostDeleteOutput)
  async deletePost(
    @CurrentUser() user: JWTPayload,
    @Args() args: PostDeleteArgs,
  ): Promise<PostDeleteOutput> {
    return await this.postService.delete(args.id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostLikeOutput)
  async likePost(
    @CurrentUser() user: JWTPayload,
    @Args() args: PostLikeArgs,
  ): Promise<PostLikeOutput> {
    return await this.postService.like(user.id, args.postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostLikeOutput)
  async unlikePost(
    @CurrentUser() user: JWTPayload,
    @Args() args: PostLikeArgs,
  ): Promise<PostLikeOutput> {
    return await this.postService.unlike(user.id, args.postId);
  }
}
