import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated.',
    schema: {
      example: {
        access_token: {
          sub: '1234567890',
          exp: 1699999999,
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  public async login(@Body() loginUserDto: LoginUserDto): Promise<{
    access_token: string;
  }> {
    return await this.authService.authenticateUser(loginUserDto.name);
  }
}
