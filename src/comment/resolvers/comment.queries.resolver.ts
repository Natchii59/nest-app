import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CommentService } from '../comment.service';
import { Comment } from '../entities/comment.entity';
import { CommentGetArgs, CommentGetOutput } from '../dto/comment-get.dto';

@Resolver(Comment)
export class CommentQueriesResolver {
  constructor(
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  @Query(() => CommentGetOutput)
  async getCommentById(
    @Args() args: CommentGetArgs,
  ): Promise<CommentGetOutput> {
    const comment = await this.commentService.getById(args.id);

    if (!comment) throw new NotFoundException();

    return { comment };
  }
}
