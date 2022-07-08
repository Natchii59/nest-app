import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { PostCreateInput, PostCreateOuput } from './dto/post-create.dto';
import { PostUpdateInput, PostUpdateOutput } from './dto/post-update.dto';
import { PostDeleteOutput } from './dto/post-delete.dto';
import { PostPagination, PostPaginationArgs } from './dto/post-pagination.dto';
import { PostLikeOutput } from './dto/post-like.dto';
import { SortDirection } from '../pagination/pagination.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    authorId: User['id'],
    input: PostCreateInput,
  ): Promise<PostCreateOuput> {
    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });
    if (!author) throw new NotFoundException();

    let post = this.postRepository.create(input);
    post.author = author;

    post = await this.postRepository.save(post);

    return { post };
  }

  async update(
    id: Post['id'],
    userId: User['id'],
    input: PostUpdateInput,
  ): Promise<PostUpdateOutput> {
    let post = await this.postRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException();

    if (post.authorId !== userId) throw new UnauthorizedException();

    post = await this.postRepository.save({
      ...post,
      ...input,
    });

    return { post };
  }

  async delete(id: Post['id'], userId: User['id']): Promise<PostDeleteOutput> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!!post && post.authorId !== userId) throw new UnauthorizedException();

    const result = await this.postRepository.delete(id);

    if (result.affected > 0) return { id };
    else return { id: null };
  }

  async getById(id: Post['id']): Promise<Post> {
    return await this.postRepository.findOne({ where: { id } });
  }

  async pagination(args: PostPaginationArgs): Promise<PostPagination> {
    const options: FindManyOptions<Post> = {
      skip: args.skip,
      take: args.take,
    };

    if (args.where) {
      options.where = {
        title:
          args.where.title !== undefined
            ? ILike(`%${args.where.title.split('').join('%')}%`)
            : null,

        author: {
          id: args.where.authorId !== undefined ? args.where.authorId : null,

          username: args.where.authorUsername
            ? ILike(`%${args.where.authorUsername.split('').join('%')}%`)
            : null,
        },
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

        title:
          args.sortBy.title !== undefined
            ? args.sortBy.title === SortDirection.ASC
              ? 'ASC'
              : 'DESC'
            : null,
      };
    }

    const [nodes, totalCount] = await this.postRepository.findAndCount(options);

    return { nodes, totalCount };
  }

  async like(userId: User['id'], postId: Post['id']): Promise<PostLikeOutput> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User Not Found');

    let post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes'],
    });

    if (!post) throw new NotFoundException('Post Not Found');

    post.likes.push(user);

    post = await this.postRepository.save(post);

    return { post };
  }

  async unlike(
    userId: User['id'],
    postId: Post['id'],
  ): Promise<PostLikeOutput> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User Not Found');

    let post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes'],
    });

    if (!post) throw new NotFoundException('Post Not Found');

    post.likes = post.likes.filter((u) => u.id !== user.id);

    post = await this.postRepository.save(post);

    return { post };
  }
}
