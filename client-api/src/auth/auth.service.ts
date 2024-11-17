import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async authenticateUser(
    name: string,
  ): Promise<{ access_token: string }> {
    let user = await this.usersRepository.findOne({ where: { name } });

    if (!user) {
      user = await this.registerUser(name);
    }

    const stringUserId = user.id.toString();
    const token = this.jwtService.sign({
      sub: stringUserId,
      iss: 'auth-service',
    });

    return {
      access_token: token,
    };
  }

  private async registerUser(name: string): Promise<User> {
    const newUser = this.usersRepository.create({ name });
    return this.usersRepository.save(newUser);
  }

  public async validateUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }
}
