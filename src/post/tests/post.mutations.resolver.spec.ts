import { Test, TestingModule } from '@nestjs/testing';
import { PostMutationsResolver } from '../resolvers/post.mutations.resolver';

describe('PostMutationsResolver', () => {
  let resolver: PostMutationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostMutationsResolver],
    }).compile();

    resolver = module.get<PostMutationsResolver>(PostMutationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
