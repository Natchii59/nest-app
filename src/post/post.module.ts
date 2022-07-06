import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostQueriesResolver } from './resolvers/post.queries.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostQueriesResolver],
})
export class PostModule {}
