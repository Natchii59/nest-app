import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { Comment } from '../entities/comment.entity';

@ArgsType()
export class CommentDeleteArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  commentId: Comment['id'];
}

@ObjectType()
export class CommentDeleteOutput {
  @Field(() => ID, { nullable: true })
  id?: Comment['id'];
}
