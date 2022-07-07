import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { UserCreateInput } from '../dto/user-create.dto';
import { UserUpdateInput } from '../dto/user-update.dto';
import { UserPaginationArgs } from '../dto/user-pagination.dto';
import { SortDirection } from '../../pagination/pagination.dto';
import { userMock } from '../../../test/mocks/user.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const userRepositoryMock = {
    create: jest.fn(() => userMock),
    save: jest.fn((user) => user),
    findOne: jest.fn(() => userMock),
    delete: jest.fn(() => ({
      affected: 1,
      raw: {},
    })),
    createQueryBuilder: jest.fn(() => userQueryBuilderMock),
  };

  const userQueryBuilderMock = {
    where: jest.fn(() => userQueryBuilderMock),
    addOrderBy: jest.fn(() => userQueryBuilderMock),
    skip: jest.fn(() => userQueryBuilderMock),
    take: jest.fn(() => userQueryBuilderMock),
    getManyAndCount: jest.fn(() => [[userMock], 1]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create User', () => {
    it('should return created user', async () => {
      const hashSyncSpy = jest.spyOn(bcrypt, 'hashSync');
      hashSyncSpy.mockReturnValueOnce(userMock.password);

      const input: UserCreateInput = {
        email: 'test@gmail.com',
        username: 'TestUsername',
        password: 'testy',
      };

      const result = await service.create(input);

      expect(hashSyncSpy).toBeCalledWith(input.password, expect.any(String));

      expect(userRepositoryMock.create).toBeCalledWith({
        ...input,
        password: userMock.password,
      });
      expect(userRepositoryMock.save).toBeCalledWith(userMock);

      expect(result.user).toEqual(userMock);
    });
  });

  describe('Update User', () => {
    it('should return updated user', async () => {
      const id = 'USERID';
      const input: UserUpdateInput = {
        username: 'TestUsername1',
      };

      const result = await service.update(id, input);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
      expect(userRepositoryMock.save).toBeCalledWith({
        ...userMock,
        ...input,
      });

      expect(result.user).toEqual({
        ...userMock,
        ...input,
      });
    });

    it('should return updated user by wrong id', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      const id = 'USERID';
      const input: UserUpdateInput = {
        username: 'TestUsername1',
      };

      try {
        await service.update(id, input);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
      expect(userRepositoryMock.save).toBeCalledTimes(0);
    });
  });

  describe('Delete User', () => {
    it('should return id of deleted user', async () => {
      const id = 'USERID';

      const result = await service.delete(id);

      expect(userRepositoryMock.delete).toBeCalledWith(id);
      expect(result.id).toEqual(id);
    });

    it('should return id of deleted user by wrong id', async () => {
      jest.spyOn(userRepository, 'delete').mockReturnValueOnce(
        new Promise((resolve) =>
          resolve({
            affected: 0,
            raw: {},
          }),
        ),
      );

      const id = 'USERID';

      const result = await service.delete(id);

      expect(userRepositoryMock.delete).toBeCalledWith(id);
      expect(result.id).toBeNull();
    });
  });

  describe('Get User', () => {
    it('should return user by id', async () => {
      const id = 'USERID';

      const result = await service.getById(id);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
      expect(result).toEqual(userMock);
    });

    it('should return user by wrong id', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      const id = 'USERID';

      const result = await service.getById(id);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });

    it('should return user by email', async () => {
      const email = 'test@gmail.com';

      const result = await service.getByEmail(email);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { email },
      });
      expect(result).toEqual(userMock);
    });

    it('should return user by wrong email', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);

      const email = 'test@gmail.com';

      const result = await service.getByEmail(email);

      expect(userRepositoryMock.findOne).toBeCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('User Pagination', () => {
    it('should return pagination of users', async () => {
      const args: UserPaginationArgs = {
        skip: 0,
        take: 10,
        sortBy: {
          username: SortDirection.ASC,
        },
      };

      const result = await service.pagination(args);

      expect(userRepositoryMock.createQueryBuilder).toBeCalledWith('user');

      expect(userQueryBuilderMock.addOrderBy).toBeCalledWith(
        'user.username',
        'ASC',
      );
      expect(userQueryBuilderMock.skip).toBeCalledWith(args.skip);
      expect(userQueryBuilderMock.take).toBeCalledWith(args.take);

      expect(userQueryBuilderMock.getManyAndCount).toBeCalledTimes(1);

      expect(result).toEqual({
        nodes: [userMock],
        totalCount: 1,
      });
    });
  });
});
