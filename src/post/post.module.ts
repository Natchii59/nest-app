import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostQueriesResolver } from './resolvers/post.queries.resolver';
import { PostMutationsResolver } from './resolvers/post.mutations.resolver';
import { PostFieldsResolver } from './resolvers/post.fields.resolver';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), UserModule],
  providers: [
    PostService,
    PostQueriesResolver,
    PostMutationsResolver,
    PostFieldsResolver,
  ],
})
export class PostModule {}
