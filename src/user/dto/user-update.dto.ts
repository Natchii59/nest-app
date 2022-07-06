import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  @ValidateIf((_o, value) => value !== undefined)
  email?: User['email'];

  @Field(() => String, { nullable: true })
  @IsAlpha()
  @ValidateIf((_o, value) => value !== undefined)
  firstName?: User['firstName'];

  @Field(() => String, { nullable: true })
  @IsAlpha()
  @ValidateIf((_o, value) => value !== undefined)
  lastName?: User['lastName'];

  @Field(() => String, { nullable: true })
  @IsAlphanumeric()
  @ValidateIf((_o, value) => value !== undefined)
  username?: User['username'];

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  bio?: User['bio'];
}

@ArgsType()
export class UserUpdateArgs {
  @Field(() => ID)
  @IsUUID()
  id: User['id'];

  @Field(() => UserUpdateInput)
  @Type(() => UserUpdateInput)
  @ValidateNested()
  input: UserUpdateInput;
}

@ObjectType()
export class UserUpdateOutput {
  @Field(() => User)
  user: User;
}
