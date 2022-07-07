import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { UserGetArgs, UserGetOutput } from '../dto/user-get.dto';
import { UserPagination, UserPaginationArgs } from '../dto/user-pagination.dto';

@Resolver(User)
export class UserQueriesResolver {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Query(() => UserGetOutput)
  async userGetById(@Args() args: UserGetArgs): Promise<UserGetOutput> {
    const user = await this.userService.getById(args.id);

    if (!user) throw new NotFoundException();

    return { user };
  }

  @Query(() => UserPagination)
  async userPagination(
    @Args() args: UserPaginationArgs,
  ): Promise<UserPagination> {
    return await this.userService.pagination(args);
  }
}
