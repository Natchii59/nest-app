import { Inject } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Comment } from '../entities/comment.entity';
import { UserService } from '../../user/user.service';
import { PostService } from '../../post/post.service';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

@Resolver(Comment)
export class CommentFieldsResolver {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(PostService) private readonly postService: PostService,
  ) {}

  @ResolveField(() => User, { nullable: true })
  async author(@Parent() comment: Comment): Promise<User> {
    if (!comment.authorId) return null;

    try {
      return await this.userService.getById(comment.authorId);
    } catch (err) {
      return null;
    }
  }

  @ResolveField(() => Post, { nullable: true })
  async post(@Parent() comment: Comment): Promise<Post> {
    if (!comment.postId) return null;

    try {
      return await this.postService.getById(comment.postId);
    } catch (err) {
      return null;
    }
  }
}
