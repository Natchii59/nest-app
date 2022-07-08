import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentMutationsResolver } from './resolvers/comment.mutations.resolver';
import { CommentQueriesResolver } from './resolvers/comment.queries.resolver';
import { CommentFieldsResolver } from './resolvers/comment.fields.resolver';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, User]),
    UserModule,
    PostModule,
  ],
  providers: [
    CommentService,
    CommentMutationsResolver,
    CommentQueriesResolver,
    CommentFieldsResolver,
  ],
})
export class CommentModule {}
