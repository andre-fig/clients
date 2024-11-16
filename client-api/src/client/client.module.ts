import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerService as ClientService } from './client.service';
import { UrlShortenerController as ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
