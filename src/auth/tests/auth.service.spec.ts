import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { jwtPayloadMock, userMock } from '../../../test/mocks/user.mock';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const userServiceMock = {
    getByEmail: jest.fn(() => userMock),
  };

  const jwtServiceMock = {
    sign: jest.fn(() => 'ACCESS_TOKEN'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('Validate User', () => {
    it('should return validated user', async () => {
      const email = 'test@gmail.com';
      const password = 'testy';

      const compareSyncSpy = jest.spyOn(bcrypt, 'compareSync');
      compareSyncSpy.mockReturnValueOnce(true);

      const result = await service.validate(email, password);

      expect(userServiceMock.getByEmail).toBeCalledWith(email);
      expect(compareSyncSpy).toBeCalledWith(password, userMock.password);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...checkResult } = userMock;
      expect(result).toEqual(checkResult);
    });

    it('should return unvalidated user with wrong password', async () => {
      const email = 'test@gmail.com';
      const password = 'testy';

      const compareSyncSpy = jest.spyOn(bcrypt, 'compareSync');
      compareSyncSpy.mockReturnValueOnce(false);

      const result = await service.validate(email, password);

      expect(userServiceMock.getByEmail).toBeCalledWith(email);
      expect(compareSyncSpy).toBeCalledWith(password, userMock.password);

      expect(result).toBeNull();
    });

    it('should return unvalidated user with wrong email', async () => {
      const email = 'test@gmail.com';
      const password = 'testy';

      jest.spyOn(userService, 'getByEmail').mockReturnValueOnce(null);

      const result = await service.validate(email, password);

      expect(userServiceMock.getByEmail).toBeCalledWith(email);

      expect(result).toBeNull();
    });
  });

  describe('Login User', () => {
    it('should return accessToken of payload user', () => {
      const result = service.login(userMock);

      expect(jwtServiceMock.sign).toBeCalledWith(jwtPayloadMock);
      expect(result.accessToken).toEqual(expect.any(String));
    });
  });
});
