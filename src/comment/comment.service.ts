import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';

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
}
