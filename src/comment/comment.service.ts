import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import {
  CommentCreateInput,
  CommentCreateOutput,
} from './dto/comment-create.dto';
import {
  CommentUpdateInput,
  CommentUpdateOutput,
} from './dto/comment-update.dto';
import { CommentDeleteOutput } from './dto/comment-delete.dto';
import { CommentLikeOutput } from './dto/comment-like.dto';
import {
  CommentPagination,
  CommentPaginationArgs,
} from './dto/comment-pagination.dto';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { SortDirection } from '../pagination/pagination.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    postId: Post['id'],
    authorId: User['id'],
    input: CommentCreateInput,
  ): Promise<CommentCreateOutput> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post Not Found');

    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });

    if (!author) throw new NotFoundException('Author Not Found');

    let comment = this.commentRepository.create(input);

    comment.post = post;
    comment.author = author;

    comment = await this.commentRepository.save(comment);

    return { comment };
  }

  async update(
    commentId: Comment['id'],
    userId: User['id'],
    input: CommentUpdateInput,
  ): Promise<CommentUpdateOutput> {
    let comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException();

    if (comment.authorId !== userId) throw new UnauthorizedException();

    comment = await this.commentRepository.save({
      ...comment,
      ...input,
    });

    return { comment };
  }

  async delete(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<CommentDeleteOutput> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!!comment && comment.authorId !== userId)
      throw new UnauthorizedException();

    const result = await this.commentRepository.delete(commentId);

    if (result.affected > 0) return { id: commentId };
    else return { id: null };
  }

  async getById(id: Comment['id']): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async like(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<CommentLikeOutput> {
    let comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['likes'],
    });

    if (!comment) throw new NotFoundException('Comment Not Found');

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User Not Found');

    comment.likes.push(user);

    comment = await this.commentRepository.save(comment);

    return { comment };
  }

  async unlike(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<CommentLikeOutput> {
    let comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['likes'],
    });

    if (!comment) throw new NotFoundException('Comment Not Found');

    comment.likes = comment.likes.filter((u) => u.id !== userId);

    comment = await this.commentRepository.save(comment);

    return { comment };
  }

  async pagination(args: CommentPaginationArgs): Promise<CommentPagination> {
    const options: FindManyOptions<Comment> = {
      skip: args.skip,
      take: args.take,
    };

    if (args.where) {
      options.where = {
        text:
          args.where.text !== undefined
            ? ILike(`%${args.where.text.split('').join('%')}%`)
            : null,

        author: {
          id: args.where.authorId !== undefined ? args.where.authorId : null,
        },

        post: {
          id: args.where.postId !== undefined ? args.where.postId : null,
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
      };
    }

    const [nodes, totalCount] = await this.commentRepository.findAndCount(
      options,
    );

    return { nodes, totalCount };
  }
}
