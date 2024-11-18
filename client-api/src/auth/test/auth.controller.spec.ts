import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should authenticate a user and return an access token', async () => {
      const loginUserDto: LoginUserDto = {
        name: 'testUser',
      };

      const accessToken = { access_token: 'signedToken' };

      jest
        .spyOn(authService, 'authenticateUser')
        .mockResolvedValue(accessToken);

      const result = await authController.login(loginUserDto);

      expect(result).toEqual(accessToken);
      expect(authService.authenticateUser).toHaveBeenCalledWith(
        loginUserDto.name,
      );
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = {
        name: 'invalidUser',
      };

      jest
        .spyOn(authService, 'authenticateUser')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
