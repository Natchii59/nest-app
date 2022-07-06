import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostCreateInput, PostCreateOuput } from '../dto/post-create.dto';
import { PostDeleteArgs, PostDeleteOutput } from '../dto/post-delete.dto';
import { PostUpdateArgs, PostUpdateOutput } from '../dto/post-update.dto';
import { Post } from '../entities/post.entity';
import { PostService } from '../post.service';

@Resolver(Post)
export class PostMutationsResolver {
  constructor(@Inject(PostService) private readonly postService: PostService) {}

  @Mutation(() => PostCreateOuput)
  async createPost(
    @Args('input') input: PostCreateInput,
  ): Promise<PostCreateOuput> {
    return await this.postService.create(input);
  }

  @Mutation(() => PostUpdateOutput)
  async updatePost(@Args() args: PostUpdateArgs): Promise<PostUpdateOutput> {
    return await this.postService.update(args.id, args.input);
  }

  @Mutation(() => PostDeleteOutput)
  async deletePost(@Args() args: PostDeleteArgs): Promise<PostDeleteOutput> {
    return await this.postService.delete(args.id);
  }
}
