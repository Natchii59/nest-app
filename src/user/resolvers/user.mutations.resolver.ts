import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserCreateInput, UserCreateOutput } from '../dto/user-create.dto';
import { UserDeleteArgs, UserDeleteOutput } from '../dto/user-delete.dto';
import { UserUpdateArgs, UserUpdateOutput } from '../dto/user-update.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

@Resolver(User)
export class UserMutationsResolver {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Mutation(() => UserCreateOutput)
  async createUser(
    @Args('input') input: UserCreateInput,
  ): Promise<UserCreateOutput> {
    return await this.userService.create(input);
  }

  @Mutation(() => UserUpdateOutput)
  async updateUser(@Args() args: UserUpdateArgs): Promise<UserUpdateOutput> {
    return await this.userService.update(args.id, args.input);
  }

  @Mutation(() => UserDeleteOutput)
  async deleteUser(@Args() args: UserDeleteArgs): Promise<UserDeleteOutput> {
    return await this.userService.delete(args.id);
  }
}
