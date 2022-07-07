import {
  ArgsType,
  Field,
  InputType,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

import { Node } from './node.entity';

export enum SortDirection {
  ASC,
  DESC,
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
});

@InputType()
export class PaginationSortBy {
  @Field(() => SortDirection, { nullable: true })
  createdAt?: SortDirection;
}

@ArgsType()
export class PaginationArgs {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  skip: number;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  take: number;

  @Field(() => PaginationSortBy, { nullable: true })
  sortBy?: PaginationSortBy;
}

@InterfaceType()
export abstract class Pagination<N extends Node = Node> {
  @Field(() => Int)
  totalCount: number;

  @Field(() => [Node])
  abstract nodes: N[];
}
