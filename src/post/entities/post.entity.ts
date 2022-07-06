import { Field, ObjectType } from '@nestjs/graphql';
import { Node } from '../../pagination/node.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';

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
}
