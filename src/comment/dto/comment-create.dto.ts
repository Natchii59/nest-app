import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

import { Comment } from '../entities/comment.entity';
import { Post } from '../../post/entities/post.entity';

@InputType()
export class CommentCreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  text: Comment['text'];
}

@ArgsType()
export class CommentCreateArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  postId: Post['id'];

  @Field(() => CommentCreateInput)
  @Type(() => CommentCreateInput)
  @ValidateNested()
  input: CommentCreateInput;
}

@ObjectType()
export class CommentCreateOutput {
  @Field(() => Comment)
  comment: Comment;
}
