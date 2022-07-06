import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class UserCreateInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: User['email'];

  @Field(() => String, { nullable: true })
  @IsAlpha()
  @IsOptional()
  firstName?: User['firstName'];

  @Field(() => String, { nullable: true })
  @IsAlpha()
  @IsOptional()
  lastName?: User['lastName'];

  @Field(() => String)
  @IsAlphanumeric()
  @IsNotEmpty()
  username: User['username'];

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: User['password'];
}

@ObjectType()
export class UserCreateOutput {
  @Field(() => User)
  user: User;
}
