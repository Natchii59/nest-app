import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortDirection } from '../pagination/pagination.dto';
import { Repository } from 'typeorm';
import { UserCreateInput, UserCreateOutput } from './dto/user-create.dto';
import { UserDeleteOutput } from './dto/user-delete.dto';
import { UserPagination, UserPaginationArgs } from './dto/user-pagination.dto';
import { UserUpdateInput, UserUpdateOutput } from './dto/user-update.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(input: UserCreateInput): Promise<UserCreateOutput> {
    let user = this.userRepository.create(input);

    user = await this.userRepository.save(user);

    return { user };
  }

  async update(
    id: User['id'],
    input: UserUpdateInput,
  ): Promise<UserUpdateOutput> {
    let user = await this.userRepository.findOne(id);

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
    return await this.userRepository.findOne(id);
  }

  async pagination(args: UserPaginationArgs): Promise<UserPagination> {
    const query = this.userRepository.createQueryBuilder('user');

    if (args.where) {
      if (args.where.username !== undefined)
        query.where('LOWER(user.username) LIKE LOWER(:username)', {
          username: `%${args.where.username.split('').join('%')}%`,
        });
      if (args.where.firstName !== undefined)
        query.where('LOWER(user.firstName) LIKE LOWER(:firstName)', {
          firstName: `%${args.where.firstName.split('').join('%')}%`,
        });
      if (args.where.lastName !== undefined)
        query.where('LOWER(user.lastName) LIKE LOWER(:lastName)', {
          lastName: `%${args.where.lastName.split('').join('%')}%`,
        });
    }

    if (args.sortBy) {
      if (args.sortBy.createdAt !== undefined)
        query.addOrderBy(
          'user.createdAt',
          args.sortBy.createdAt === SortDirection.ASC ? 'ASC' : 'DESC',
        );
      if (args.sortBy.username !== undefined)
        query.addOrderBy(
          'user.username',
          args.sortBy.username === SortDirection.ASC ? 'ASC' : 'DESC',
        );
      if (args.sortBy.firstName !== undefined)
        query.addOrderBy(
          'user.firstName',
          args.sortBy.firstName === SortDirection.ASC ? 'ASC' : 'DESC',
        );
      if (args.sortBy.lastName !== undefined)
        query.addOrderBy(
          'user.lastName',
          args.sortBy.lastName === SortDirection.ASC ? 'ASC' : 'DESC',
        );
    }

    query.skip(args.skip);
    query.take(args.take);

    const [nodes, totalCount] = await query.getManyAndCount();

    return { nodes, totalCount };
  }
}
