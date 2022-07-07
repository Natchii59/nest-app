import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: User['email'],
    password: User['password'],
  ): Promise<any> {
    const user = await this.authService.validate(email, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
