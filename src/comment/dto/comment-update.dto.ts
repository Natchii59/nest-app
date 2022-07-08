import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { Comment } from '../entities/comment.entity';

@InputType()
export class CommentUpdateInput {
  @Field(() => String)
  @IsString()
  @ValidateIf((_o, value) => value !== undefined)
  text: Comment['text'];
}

@ArgsType()
export class CommentUpdateArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  commentId: Comment['id'];

  @Field(() => CommentUpdateInput)
  @Type(() => CommentUpdateInput)
  @ValidateNested()
  input: CommentUpdateInput;
}

@ObjectType()
export class CommentUpdateOutput {
  @Field(() => Comment)
  comment: Comment;
}
