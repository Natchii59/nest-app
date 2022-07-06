import { Test, TestingModule } from '@nestjs/testing';
import { UserMutationsResolver } from '../resolvers/user.mutations.resolver';

describe('UserMutationsResolver', () => {
  let resolver: UserMutationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMutationsResolver],
    }).compile();

    resolver = module.get<UserMutationsResolver>(UserMutationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
