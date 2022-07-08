import { Inject } from '@nestjs/common';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Post } from '../entities/post.entity';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import {
  CommentPagination,
  CommentPaginationArgs,
} from '../../comment/dto/comment-pagination.dto';
import { CommentService } from '../../comment/comment.service';

@Resolver(Post)
export class PostFieldsResolver {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  @ResolveField(() => User, { nullable: true })
  async author(@Parent() post: Post): Promise<User> {
    if (!post.authorId) return null;

    try {
      return await this.userService.getById(post.authorId);
    } catch (err) {
      return null;
    }
  }

  @ResolveField(() => Number)
  likes(@Parent() post: Post): number {
    return post.likesIds.length;
  }

  @ResolveField(() => CommentPagination)
  async commentsPagination(
    @Parent() post: Post,
    @Args() args: CommentPaginationArgs,
  ): Promise<CommentPagination> {
    return await this.commentService.pagination({
      ...args,
      where: {
        postId: post.id,
      },
    });
  }
}
