import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthLoginOutput } from './dto/auth-login.dto';
import { JWTPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async validate(
    email: User['email'],
    password: User['password'],
  ): Promise<any> {
    const user = await this.userService.getByEmail(email);

    if (user && compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: User): AuthLoginOutput {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
