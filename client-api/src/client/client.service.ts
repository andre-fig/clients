import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  public async createClient(
    createClientDto: CreateClientDto,
    userId: string,
  ): Promise<Client> {
    const client = this.clientRepository.create({
      ...createClientDto,
      createdBy: { id: userId },
    });

    return await this.clientRepository.save(client);
  }

  public async getClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  public async getAllClients(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ total: number; clients: Client[] }> {
    const [clients, total] = await this.clientRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        updatedAt: 'DESC',
      },
    });

    return { total, clients };
  }

  public async updateClient(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  public async deleteClient(id: string): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientRepository.softRemove(client);
  }
}
