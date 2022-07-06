import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserDeleteArgs {
  @Field(() => ID)
  @IsUUID()
  id: User['id'];
}

@ObjectType()
export class UserDeleteOutput {
  @Field(() => ID, { nullable: true })
  id?: User['id'];
}
