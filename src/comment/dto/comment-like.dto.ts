import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { Comment } from '../entities/comment.entity';

@ArgsType()
export class CommentLikeArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  commentId: Comment['id'];
}

@ObjectType()
export class CommentLikeOutput {
  @Field(() => Comment)
  comment: Comment;
}
