import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostQueriesResolver } from './resolvers/post.queries.resolver';
import { PostMutationsResolver } from './resolvers/post.mutations.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostQueriesResolver, PostMutationsResolver],
})
export class PostModule {}
