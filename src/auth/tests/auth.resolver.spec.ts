import { Test, TestingModule } from '@nestjs/testing';

import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { AuthLoginArgs } from '../dto/auth-login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { jwtPayloadMock, userMock } from '../../../test/mocks/user.mock';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const authServiceMock = {
    login: jest.fn(() => ({
      accessToken: 'ACCCESS_TOKEN',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('Login', () => {
    it('should return accessToken of logged user', async () => {
      const args: AuthLoginArgs = {
        email: 'test@gmail.com',
        password: 'testy',
      };

      const result = await resolver.authLogin(userMock, args);

      expect(authServiceMock.login).toBeCalledWith(userMock);
      expect(result.accessToken).toEqual(expect.any(String));
    });

    it('should have the guard LocalAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthResolver.prototype.authLogin,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(LocalAuthGuard);
    });
  });

  describe('Profile', () => {
    it('should return payload of current user', async () => {
      const result = await resolver.getProfile(jwtPayloadMock);

      expect(result).toEqual(jwtPayloadMock);
    });

    it('should have the guard JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthResolver.prototype.getProfile,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });
});
