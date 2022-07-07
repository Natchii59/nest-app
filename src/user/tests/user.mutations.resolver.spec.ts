import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user.service';
import { UserMutationsResolver } from '../resolvers/user.mutations.resolver';
import { UserCreateInput } from '../dto/user-create.dto';
import { UserUpdateInput } from '../dto/user-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { jwtPayloadMock, userMock } from '../../../test/mocks/user.mock';

describe('UserMutationsResolver', () => {
  let resolver: UserMutationsResolver;
  let userService: UserService;

  const userServiceMock = {
    create: jest.fn(() => ({
      user: userMock,
    })),
    update: jest.fn((_id, input) => ({
      user: {
        ...userMock,
        ...input,
      },
    })),
    delete: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMutationsResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UserMutationsResolver>(UserMutationsResolver);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Create User', () => {
    it('should return created user', async () => {
      const input: UserCreateInput = {
        email: 'test@gmail.com',
        username: 'TestUsername',
        password: 'testy',
      };

      const result = await resolver.createUser(input);

      expect(userServiceMock.create).toBeCalledWith(input);
      expect(result.user).toEqual(userMock);
    });
  });

  describe('Update User', () => {
    it('should return updated user by id', async () => {
      const input: UserUpdateInput = {
        username: 'testy',
      };

      const result = await resolver.updateUser(jwtPayloadMock, input);

      expect(userServiceMock.update).toBeCalledWith(jwtPayloadMock.id, input);
      expect(result.user).toEqual({
        ...userMock,
        ...input,
      });
    });

    it('should return updated user by wrong id', async () => {
      jest.spyOn(userService, 'update').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      const input: UserUpdateInput = {
        username: 'testy',
      };

      try {
        await resolver.updateUser(jwtPayloadMock, input);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(userServiceMock.update).toBeCalledWith(jwtPayloadMock.id, input);
    });

    it('should have the guard JWTAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UserMutationsResolver.prototype.updateUser,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });

  describe('Delete User', () => {
    it('should return deleted user id', async () => {
      const result = await resolver.deleteUser(jwtPayloadMock);

      expect(userServiceMock.delete).toBeCalledWith(jwtPayloadMock.id);
      expect(result.id).toEqual(jwtPayloadMock.id);
    });

    it('should return deleted user id by wrong id', async () => {
      jest
        .spyOn(userService, 'delete')
        .mockReturnValueOnce(new Promise((resolve) => resolve({ id: null })));

      const result = await resolver.deleteUser(jwtPayloadMock);

      expect(userServiceMock.delete).toBeCalledWith(jwtPayloadMock.id);
      expect(result.id).toBeNull();
    });
  });
});
