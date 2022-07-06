import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthLoginArgs, AuthLoginOutput } from './dto/auth-login.dto';
import { JWTPayload } from './dto/jwt-payload.dto';
import { CurrentUser, JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Resolver('auth')
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthLoginOutput)
  async authLogin(
    @CurrentUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args() _args: AuthLoginArgs,
  ): Promise<AuthLoginOutput> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => JWTPayload)
  getProfile(@CurrentUser() user: JWTPayload): JWTPayload {
    return user;
  }
}
