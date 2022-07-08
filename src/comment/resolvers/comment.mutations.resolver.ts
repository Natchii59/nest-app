import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CommentService } from '../comment.service';
import { Comment } from '../entities/comment.entity';
import {
  CommentCreateArgs,
  CommentCreateOutput,
} from '../dto/comment-create.dto';
import {
  CommentUpdateArgs,
  CommentUpdateOutput,
} from '../dto/comment-update.dto';
import {
  CommentDeleteArgs,
  CommentDeleteOutput,
} from '../dto/comment-delete.dto';
import { CommentLikeArgs, CommentLikeOutput } from '../dto/comment-like.dto';
import { JWTPayload } from '../../auth/dto/jwt-payload.dto';
import { CurrentUser, JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(Comment)
export class CommentMutationsResolver {
  constructor(
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentCreateOutput)
  async createComment(
    @CurrentUser() user: JWTPayload,
    @Args() args: CommentCreateArgs,
  ): Promise<CommentCreateOutput> {
    return await this.commentService.create(args.postId, user.id, args.input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentUpdateOutput)
  async updateComment(
    @CurrentUser() user: JWTPayload,
    @Args() args: CommentUpdateArgs,
  ): Promise<CommentUpdateOutput> {
    return await this.commentService.update(
      args.commentId,
      user.id,
      args.input,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentDeleteOutput)
  async deleteComment(
    @CurrentUser() user: JWTPayload,
    @Args() args: CommentDeleteArgs,
  ): Promise<CommentDeleteOutput> {
    return await this.commentService.delete(args.commentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentLikeOutput)
  async likeComment(
    @CurrentUser() user: JWTPayload,
    @Args() args: CommentLikeArgs,
  ): Promise<CommentLikeOutput> {
    return await this.commentService.like(args.commentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentLikeOutput)
  async unlikeComment(
    @CurrentUser() user: JWTPayload,
    @Args() args: CommentLikeArgs,
  ): Promise<CommentLikeOutput> {
    return await this.commentService.unlike(args.commentId, user.id);
  }
}
