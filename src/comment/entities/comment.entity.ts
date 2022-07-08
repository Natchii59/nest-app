import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';

import { Node } from '../../pagination/node.entity';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
@ObjectType()
export class Comment extends Node {
  @Column()
  @Field(() => String)
  text: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn()
  post: Post;

  @RelationId((comment: Comment) => comment.post)
  readonly postId: Post['id'];

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  author: User;

  @RelationId((comment: Comment) => comment.author)
  readonly authorId: User['id'];

  @ManyToMany(() => User, (user) => user.likedComments)
  @JoinTable()
  likes: User[];

  @RelationId((comment: Comment) => comment.likes)
  readonly likesIds: User['id'][];
}
