import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserGetArgs {
  @Field(() => ID)
  @IsUUID()
  id: User['id'];
}

@ObjectType()
export class UserGetOutput {
  @Field(() => User)
  user: User;
}
