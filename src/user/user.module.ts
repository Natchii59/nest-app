import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserQueriesResolver } from './resolvers/user.queries.resolver';
import { UserMutationsResolver } from './resolvers/user.mutations.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserQueriesResolver, UserMutationsResolver],
  exports: [UserService],
})
export class UserModule {}
