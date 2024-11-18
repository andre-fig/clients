import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const name = 'testUser';

      jest.spyOn(usersRepository, 'create').mockReturnValue({ name } as User);
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue({ id: 'uuid', name } as User);

      const result = await (authService as any).registerUser(name);

      expect(result).toEqual({ id: 'uuid', name });
      expect(usersRepository.create).toHaveBeenCalledWith({ name });
      expect(usersRepository.save).toHaveBeenCalledWith({ name });
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate an existing user and return a JWT token', async () => {
      const name = 'testUser';
      const user = { id: 'uuid', name } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('signedToken');

      const result = await authService.authenticateUser(name);

      expect(result).toEqual({ access_token: 'signedToken' });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'uuid',
        iss: 'client-api',
      });
    });

    it('should register a new user if the user does not exist and return a JWT token', async () => {
      const name = 'newUser';
      const newUser = { id: 'uuid', name } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('signedToken');

      const result = await authService.authenticateUser(name);

      expect(result).toEqual({ access_token: 'signedToken' });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(usersRepository.create).toHaveBeenCalledWith({ name });
      expect(usersRepository.save).toHaveBeenCalledWith(newUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'uuid',
        iss: 'client-api',
      });
    });
  });

  describe('validateUserById', () => {
    it('should return a user if found', async () => {
      const user = { id: 'uuid', name: 'testUser' } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await authService.validateUserById('uuid');

      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
      });
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUserById('1');

      expect(result).toBeNull();
    });
  });
});
