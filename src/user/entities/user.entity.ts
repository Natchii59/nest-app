import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

import { Node } from '../../pagination/node.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
@ObjectType()
export class User extends Node {
  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  lastName?: string;

  @Column({ unique: true })
  @Field(() => String)
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  bio?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likes)
  likedPosts: Post[];
}
