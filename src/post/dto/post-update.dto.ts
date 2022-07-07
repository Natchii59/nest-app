import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { Post } from '../entities/post.entity';

@InputType()
export class PostUpdateInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @ValidateIf((_o, value) => value !== undefined)
  title?: Post['title'];

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: Post['description'];
}

@ArgsType()
export class PostUpdateArgs {
  @Field(() => ID)
  @IsUUID()
  id: Post['id'];

  @Field(() => PostUpdateInput)
  @Type(() => PostUpdateInput)
  @ValidateNested()
  input: PostUpdateInput;
}

@ObjectType()
export class PostUpdateOutput {
  @Field(() => Post)
  post: Post;
}
