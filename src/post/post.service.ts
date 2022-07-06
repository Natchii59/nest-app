import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortDirection } from '../pagination/pagination.dto';
import { Repository } from 'typeorm';
import { PostCreateInput, PostCreateOuput } from './dto/post-create.dto';
import { PostDeleteOutput } from './dto/post-delete.dto';
import { PostPagination, PostPaginationArgs } from './dto/post-pagination.dto';
import { PostUpdateInput, PostUpdateOutput } from './dto/post-update.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(input: PostCreateInput): Promise<PostCreateOuput> {
    let post = this.postRepository.create(input);

    post = await this.postRepository.save(post);

    return { post };
  }

  async update(
    id: Post['id'],
    input: PostUpdateInput,
  ): Promise<PostUpdateOutput> {
    let post = await this.postRepository.findOne(id);

    if (!post) throw new NotFoundException();

    post = await this.postRepository.save({
      ...post,
      ...input,
    });

    return { post };
  }

  async delete(id: Post['id']): Promise<PostDeleteOutput> {
    const result = await this.postRepository.delete(id);

    if (result.affected > 0) return { id };
    else return { id: null };
  }

  async getById(id: Post['id']): Promise<Post> {
    return await this.postRepository.findOne(id);
  }

  async pagination(args: PostPaginationArgs): Promise<PostPagination> {
    const query = this.postRepository.createQueryBuilder('post');

    if (args.where) {
      if (args.where.title !== undefined)
        query.where('LOWER(post.title) LIKE LOWER(:title)', {
          title: `%${args.where.title.split('').join('%')}%`,
        });
    }

    if (args.sortBy) {
      if (args.sortBy.createdAt !== undefined)
        query.addOrderBy(
          'post.createdAt',
          args.sortBy.createdAt === SortDirection.ASC ? 'ASC' : 'DESC',
        );
      if (args.sortBy.title !== undefined)
        query.addOrderBy(
          'post.title',
          args.sortBy.title === SortDirection.ASC ? 'ASC' : 'DESC',
        );
    }

    query.skip(args.skip);
    query.take(args.take);

    const [nodes, totalCount] = await query.getManyAndCount();

    return { nodes, totalCount };
  }
}
