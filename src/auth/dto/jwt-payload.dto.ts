import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class JWTPayload {
  @Field(() => ID)
  id: User['id'];

  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  username: User['username'];
}
