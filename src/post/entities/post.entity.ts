import { Field, ObjectType } from '@nestjs/graphql';
import { Node } from 'src/pagination/node.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Post extends Node {
  @Column()
  @Field(() => String)
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;
}
