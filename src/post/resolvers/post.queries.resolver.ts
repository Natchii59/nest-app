import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostGetArgs, PostGetOutput } from '../dto/post-get.dto';
import { Post } from '../entities/post.entity';
import { PostService } from '../post.service';

@Resolver(Post)
export class PostQueriesResolver {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Query(() => PostGetOutput)
  async getPostById(@Args() args: PostGetArgs): Promise<PostGetOutput> {
    const post = await this.postService.getById(args.id);

    if (!post) throw new NotFoundException();

    return { post };
  }
}
