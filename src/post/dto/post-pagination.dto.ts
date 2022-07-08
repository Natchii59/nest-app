import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  Pagination,
  PaginationArgs,
  PaginationSortBy,
  SortDirection,
} from '../../pagination/pagination.dto';
import { Post } from '../entities/post.entity';
import { User } from '../../user/entities/user.entity';

@InputType()
export class PostPaginationSortBy extends PaginationSortBy {
  @Field(() => SortDirection, { nullable: true })
  title?: SortDirection;
}

@InputType()
export class PostPaginationWhere {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  title?: Post['title'];

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  authorId?: User['id'];

  @Field(() => String, { nullable: true })
  @IsAlphanumeric()
  @IsOptional()
  authorUsername?: User['username'];
}

@ArgsType()
export class PostPaginationArgs extends PaginationArgs {
  @Field(() => PostPaginationSortBy, { nullable: true })
  sortBy?: PostPaginationSortBy;

  @Field(() => PostPaginationWhere, { nullable: true })
  @Type(() => PostPaginationWhere)
  @ValidateNested()
  where?: PostPaginationWhere;
}

@ObjectType()
export class PostPagination extends Pagination {
  @Field(() => [Post])
  nodes: Post[];
}
