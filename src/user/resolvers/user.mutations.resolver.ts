import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JWTPayload } from '../../auth/dto/jwt-payload.dto';
import { CurrentUser, JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserCreateInput, UserCreateOutput } from '../dto/user-create.dto';
import { UserDeleteOutput } from '../dto/user-delete.dto';
import { UserUpdateInput, UserUpdateOutput } from '../dto/user-update.dto';
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserUpdateOutput)
  async updateUser(
    @CurrentUser() user: JWTPayload,
    @Args('input') input: UserUpdateInput,
  ): Promise<UserUpdateOutput> {
    return await this.userService.update(user.id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserDeleteOutput)
  async deleteUser(@CurrentUser() user: JWTPayload): Promise<UserDeleteOutput> {
    return await this.userService.delete(user.id);
  }
}
