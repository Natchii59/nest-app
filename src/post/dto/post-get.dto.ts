import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import { Post } from '../entities/post.entity';

@ArgsType()
export class PostGetArgs {
  @Field(() => ID)
  @IsUUID()
  id: Post['id'];
}

@ObjectType()
export class PostGetOutput {
  @Field(() => Post)
  post: Post;
}
