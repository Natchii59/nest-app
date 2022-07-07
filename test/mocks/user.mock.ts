import { JWTPayload } from 'src/auth/dto/jwt-payload.dto';
import { User } from 'src/user/entities/user.entity';

export const userMock: User = {
  id: 'USERID',
  createdAt: new Date('2022-01-01T01:00:00'),
  updatedAt: new Date('2022-01-01T01:00:00'),
  email: 'test@gmail.com',
  username: 'TestUsername',
  password: '$2b$10$d0sXYGSNQj0RqeQzVmlqCeddmw6MvrDMrBDmZ98z9BDm3qh0EHkIm',
  firstName: null,
  lastName: null,
  bio: null,
  posts: [],
};

export const jwtPayloadMock: JWTPayload = {
  id: 'USERID',
  email: 'test@gmail.com',
  username: 'TestUsername',
};
