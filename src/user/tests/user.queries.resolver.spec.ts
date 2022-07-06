import { Test, TestingModule } from '@nestjs/testing';
import { UserQueriesResolver } from '../resolvers/user.queries.resolver';

describe('UserQueriesResolver', () => {
  let resolver: UserQueriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQueriesResolver],
    }).compile();

    resolver = module.get<UserQueriesResolver>(UserQueriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
