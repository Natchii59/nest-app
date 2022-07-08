import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Comment } from '../entities/comment.entity';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { Pagination, PaginationArgs } from '../../pagination/pagination.dto';

@InputType()
export class CommentPaginationWhere {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  text?: Comment['text'];

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  authorId?: User['id'];

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  postId?: Post['id'];
}

@ArgsType()
export class CommentPaginationArgs extends PaginationArgs {
  @Field(() => CommentPaginationWhere, { nullable: true })
  @Type(() => CommentPaginationWhere)
  @ValidateNested()
  where?: CommentPaginationWhere;
}

@ObjectType()
export class CommentPagination extends Pagination {
  @Field(() => [Comment])
  nodes: Comment[];
}
