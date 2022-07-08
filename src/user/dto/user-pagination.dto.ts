import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsAlphanumeric,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import {
  Pagination,
  PaginationArgs,
  PaginationSortBy,
  SortDirection,
} from '../../pagination/pagination.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UserPaginationSortBy extends PaginationSortBy {
  @Field(() => SortDirection, { nullable: true })
  username?: SortDirection;

  @Field(() => SortDirection, { nullable: true })
  firstName?: SortDirection;

  @Field(() => SortDirection, { nullable: true })
  lastName?: SortDirection;
}

@InputType()
export class UserPaginationWhere {
  @Field(() => String, { nullable: true })
  @IsAlphanumeric()
  @IsOptional()
  username?: User['username'];

  @Field(() => String, { nullable: true })
  @IsAlpha()
  @IsOptional()
  firstName?: User['firstName'];

  @Field(() => String, { nullable: true })
  @IsAlpha()
  @IsOptional()
  lastName?: User['lastName'];
}

@ArgsType()
export class UserPaginationArgs extends PaginationArgs {
  @Field(() => UserPaginationSortBy, { nullable: true })
  sortBy?: UserPaginationSortBy;

  @Field(() => UserPaginationWhere, { nullable: true })
  @Type(() => UserPaginationWhere)
  @ValidateNested()
  where?: UserPaginationWhere;
}

@ObjectType()
export class UserPagination extends Pagination {
  @Field(() => [User])
  nodes: User[];
}
