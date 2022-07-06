import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCreateInput, PostCreateOuput } from './dto/post-create.dto';
import { PostDeleteOutput } from './dto/post-delete.dto';
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
}
