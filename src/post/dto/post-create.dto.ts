import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Post } from '../entities/post.entity';

@InputType()
export class PostCreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  title: Post['title'];

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: Post['description'];
}

@ObjectType()
export class PostCreateOuput {
  @Field(() => Post)
  post: Post;
}
