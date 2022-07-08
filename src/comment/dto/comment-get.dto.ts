import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { Comment } from '../entities/comment.entity';

@ArgsType()
export class CommentGetArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: Comment['id'];
}

@ObjectType()
export class CommentGetOutput {
  @Field(() => Comment)
  comment: Comment;
}
