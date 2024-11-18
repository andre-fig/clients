import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Client, User]), LogModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
