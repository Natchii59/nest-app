import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

import { User } from './entities/user.entity';
import { UserCreateInput, UserCreateOutput } from './dto/user-create.dto';
import { UserUpdateInput, UserUpdateOutput } from './dto/user-update.dto';
import { UserDeleteOutput } from './dto/user-delete.dto';
import { UserPagination, UserPaginationArgs } from './dto/user-pagination.dto';
import { SortDirection } from '../pagination/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(input: UserCreateInput): Promise<UserCreateOutput> {
    let user = this.userRepository.create({
      ...input,
      password: hashSync(input.password, genSaltSync()),
    });

    user = await this.userRepository.save(user);

    return { user };
  }

  async update(
    id: User['id'],
    input: UserUpdateInput,
  ): Promise<UserUpdateOutput> {
    let user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    user = await this.userRepository.save({
      ...user,
      ...input,
    });

    return { user };
  }

  async delete(id: User['id']): Promise<UserDeleteOutput> {
    const result = await this.userRepository.delete(id);

    if (result.affected > 0) return { id };
    else return { id: null };
  }

  async getById(id: User['id']): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getByEmail(email: User['email']): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async pagination(args: UserPaginationArgs): Promise<UserPagination> {
    const options: FindManyOptions<User> = {
      skip: args.skip,
      take: args.take,
    };

    if (args.where) {
      options.where = {
        username:
          args.where.username !== undefined
            ? ILike(`%${args.where.username.split('').join('%')}%`)
            : null,

        firstName:
          args.where.firstName !== undefined
            ? ILike(`%${args.where.firstName.split('').join('%')}%`)
            : null,

        lastName:
          args.where.lastName !== undefined
            ? ILike(`%${args.where.lastName.split('').join('%')}%`)
            : null,
      };
    }

    if (args.sortBy) {
      options.order = {
        createdAt:
          args.sortBy.createdAt !== undefined
            ? args.sortBy.createdAt === SortDirection.ASC
              ? 'ASC'
              : 'DESC'
            : null,

        username:
          args.sortBy.username !== undefined
            ? args.sortBy.username === SortDirection.ASC
              ? 'ASC'
              : 'DESC'
            : null,

        firstName:
          args.sortBy.firstName !== undefined
            ? args.sortBy.firstName === SortDirection.ASC
              ? 'ASC'
              : 'DESC'
            : null,

        lastName:
          args.sortBy.lastName !== undefined
            ? args.sortBy.lastName === SortDirection.ASC
              ? 'ASC'
              : 'DESC'
            : null,
      };
    }

    const [nodes, totalCount] = await this.userRepository.findAndCount(options);

    return { nodes, totalCount };
  }
}
