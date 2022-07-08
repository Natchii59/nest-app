import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

import { Node } from '../../pagination/node.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
@ObjectType()
export class Post extends Node {
  @Column()
  @Field(() => String)
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: User;

  @RelationId((post: Post) => post.author)
  readonly authorId: User['id'];

  @ManyToMany(() => User, (user) => user.likedPosts, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: User[];

  @RelationId((post: Post) => post.likes)
  readonly likesIds: User['id'][];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
