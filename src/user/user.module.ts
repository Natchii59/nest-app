import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserQueriesResolver } from './resolvers/user.queries.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './resolvers/user.resolverr.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserQueriesResolver, UserResolver],
})
export class UserModule {}
