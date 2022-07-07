import { Test, TestingModule } from '@nestjs/testing';

import { PostQueriesResolver } from '../resolvers/post.queries.resolver';

describe('PostQueriesResolver', () => {
  let resolver: PostQueriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostQueriesResolver],
    }).compile();

    resolver = module.get<PostQueriesResolver>(PostQueriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
