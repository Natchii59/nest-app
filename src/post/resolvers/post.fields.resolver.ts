import { Inject } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { User } from '../../user/entities/user.entity';
import { Post } from '../entities/post.entity';

@Resolver(Post)
export class PostFieldsResolver {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @ResolveField(() => User, { nullable: true })
  async author(@Parent() post: Post): Promise<User> {
    if (!post.authorId) return null;

    try {
      return await this.userService.getById(post.authorId);
    } catch (e) {
      return null;
    }
  }
}