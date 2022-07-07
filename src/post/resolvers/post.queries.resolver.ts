import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { PostService } from '../post.service';
import { Post } from '../entities/post.entity';
import { PostGetArgs, PostGetOutput } from '../dto/post-get.dto';
import { PostPagination, PostPaginationArgs } from '../dto/post-pagination.dto';

@Resolver(Post)
export class PostQueriesResolver {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Query(() => PostGetOutput)
  async getPostById(@Args() args: PostGetArgs): Promise<PostGetOutput> {
    const post = await this.postService.getById(args.id);

    if (!post) throw new NotFoundException();

    return { post };
  }

  @Query(() => PostPagination)
  async postPagination(
    @Args() args: PostPaginationArgs,
  ): Promise<PostPagination> {
    return await this.postService.pagination(args);
  }
}
