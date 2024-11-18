import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Client } from '../entities/client.entity';
import { ClientService } from '../client.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';

describe('ClientService', () => {
  let clientService: ClientService;
  let clientRepository: Repository<Client>;

  const mockUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'testuser@example.com',
    clients: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useClass: Repository,
        },
      ],
    }).compile();

    clientService = module.get<ClientService>(ClientService);
    clientRepository = module.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        salary: 1000,
        companyValue: 10000,
      };
      const userId = 'user-id';
      const mockClient: Client = {
        id: 'client-id',
        name: createClientDto.name,
        salary: createClientDto.salary,
        companyValue: createClientDto.companyValue,
        createdBy: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(clientRepository, 'create').mockReturnValue(mockClient);
      jest.spyOn(clientRepository, 'save').mockResolvedValue(mockClient);

      const result = await clientService.createClient(createClientDto, userId);

      expect(result).toEqual(mockClient);
      expect(clientRepository.create).toHaveBeenCalledWith({
        ...createClientDto,
        createdBy: { id: userId },
      });
      expect(clientRepository.save).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('getClientById', () => {
    it('should return the client by ID', async () => {
      const clientId = 'client-id';
      const mockClient: Client = {
        id: clientId,
        name: 'John Doe',
        salary: 1000,
        companyValue: 10000,
        createdBy: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(mockClient);

      const result = await clientService.getClientById(clientId);

      expect(result).toEqual(mockClient);
      expect(clientRepository.findOne).toHaveBeenCalledWith({
        where: { id: clientId },
      });
    });

    it('should throw NotFoundException if client is not found', async () => {
      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      await expect(clientService.getClientById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllClients', () => {
    it('should return a paginated list of clients', async () => {
      const mockClients: Client[] = [
        {
          id: 'client-id',
          name: 'John Doe',
          salary: 1000,
          companyValue: 10000,
          createdBy: mockUser,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const total = 1;

      jest
        .spyOn(clientRepository, 'findAndCount')
        .mockResolvedValue([mockClients, total]);

      const result = await clientService.getAllClients(1, 10);

      expect(result).toEqual({ total, clients: mockClients });
      expect(clientRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { updatedAt: 'DESC' },
      });
    });

    it('should return a paginated list of clients with no page and limit', async () => {
      const mockClients: Client[] = [
        {
          id: 'client-id',
          name: 'John Doe',
          salary: 1000,
          companyValue: 10000,
          createdBy: mockUser,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const total = 1;

      jest
        .spyOn(clientRepository, 'findAndCount')
        .mockResolvedValue([mockClients, total]);

      const result = await clientService.getAllClients();

      expect(result).toEqual({ total, clients: mockClients });
      expect(clientRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { updatedAt: 'DESC' },
      });
    });
  });

  describe('updateClient', () => {
    it('should update the client details', async () => {
      const clientId = 'client-id';
      const updateClientDto: UpdateClientDto = { name: 'Updated Client' };
      const mockClient: Client = {
        id: clientId,
        name: 'John Doe',
        salary: 1000,
        companyValue: 10000,
        createdBy: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(mockClient);
      jest.spyOn(clientRepository, 'save').mockResolvedValue(mockClient);

      const result = await clientService.updateClient(
        clientId,
        updateClientDto,
      );

      expect(result).toEqual(mockClient);
      expect(clientRepository.save).toHaveBeenCalledWith({
        ...mockClient,
        ...updateClientDto,
      });
    });

    it('should throw NotFoundException if client is not found', async () => {
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
        salary: 2000,
        companyValue: 15000,
      };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      await expect(
        clientService.updateClient('invalid-id', updateClientDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteClient', () => {
    it('should delete the client', async () => {
      const clientId = 'client-id';
      const mockClient: Client = {
        id: clientId,
        name: 'John Doe',
        salary: 1000,
        companyValue: 10000,
        createdBy: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(mockClient);
      const softRemoveSpy = jest
        .spyOn(clientRepository, 'softRemove')
        .mockResolvedValue(mockClient);

      await clientService.deleteClient(clientId);

      expect(softRemoveSpy).toHaveBeenCalledWith(mockClient);
    });

    it('should throw NotFoundException if client is not found', async () => {
      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      await expect(clientService.deleteClient('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
