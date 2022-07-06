import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Pagination,
  PaginationArgs,
  PaginationSortBy,
  SortDirection,
} from '../../pagination/pagination.dto';
import { Post } from '../entities/post.entity';

@InputType()
export class PostPaginationSortBy extends PaginationSortBy {
  @Field(() => SortDirection, { nullable: true })
  title?: SortDirection;
}

@InputType()
export class PostPaginationWhere {
  @Field(() => String, { nullable: true })
  title?: Post['title'];
}

@ArgsType()
export class PostPaginationArgs extends PaginationArgs {
  @Field(() => PostPaginationSortBy, { nullable: true })
  sortBy?: PostPaginationSortBy;

  @Field(() => PostPaginationWhere, { nullable: true })
  where?: PostPaginationWhere;
}

@ObjectType()
export class PostPagination extends Pagination {
  @Field(() => [Post])
  nodes: Post[];
}
