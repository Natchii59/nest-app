import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class AuthLoginArgs {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class AuthLoginOutput {
  @Field(() => String)
  accessToken: string;
}
