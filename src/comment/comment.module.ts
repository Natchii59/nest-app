import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentMutationsResolver } from './resolvers/comment.mutations.resolver';
import { CommentQueriesResolver } from './resolvers/comment.queries.resolver';
import { CommentFieldsResolver } from './resolvers/comment.fields.resolver';
import { Comment } from './entities/comment.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { PostModule } from '../post/post.module';
import { Post } from '../post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, User]),
    UserModule,
    forwardRef(() => PostModule),
  ],
  providers: [
    CommentService,
    CommentMutationsResolver,
    CommentQueriesResolver,
    CommentFieldsResolver,
  ],
  exports: [CommentService],
})
export class CommentModule {}
