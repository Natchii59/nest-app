import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { Post } from '../entities/post.entity';

@ArgsType()
export class PostLikeArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  postId: Post['id'];
}

@ObjectType()
export class PostLikeOutput {
  @Field(() => Post)
  post: Post;
}
