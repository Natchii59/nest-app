import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Post } from '../entities/post.entity';

@ArgsType()
export class PostDeleteArgs {
  @Field(() => ID)
  @IsUUID()
  id: Post['id'];
}

@ObjectType()
export class PostDeleteOutput {
  @Field(() => ID, { nullable: true })
  id?: Post['id'];
}
