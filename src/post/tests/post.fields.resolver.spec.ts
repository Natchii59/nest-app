import { Test, TestingModule } from '@nestjs/testing';

import { PostFieldsResolver } from '../resolvers/post.fields.resolver';

describe('PostFieldsResolver', () => {
  let resolver: PostFieldsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostFieldsResolver],
    }).compile();

    resolver = module.get<PostFieldsResolver>(PostFieldsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
