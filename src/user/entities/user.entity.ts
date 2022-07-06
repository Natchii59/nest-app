import { Field, ObjectType } from '@nestjs/graphql';
import { Node } from '../../pagination/node.entity';
import { Column, Entity } from 'typeorm';

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
}
