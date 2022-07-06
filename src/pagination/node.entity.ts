import { Field, ID, InterfaceType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@InterfaceType()
export abstract class Node {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
