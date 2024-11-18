import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClientController } from '../client.controller';
import { ClientService } from '../client.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { Client } from '../entities/client.entity';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { LogInterceptor } from '../../log/interceptors/log.interceptor';
import { LogQueue } from '../../log/queues/log.queue';

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;

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
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: {
            createClient: jest.fn(),
            getClientById: jest.fn(),
            getAllClients: jest.fn(),
            updateClient: jest.fn(),
            deleteClient: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
        {
          provide: LogQueue,
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: LogInterceptor,
          useClass: LogInterceptor,
        },
      ],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });

  describe('create', () => {
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

      jest.spyOn(clientService, 'createClient').mockResolvedValue(mockClient);

      const result = await clientController.create(userId, createClientDto);

      expect(result).toEqual(mockClient);
      expect(clientService.createClient).toHaveBeenCalledWith(
        createClientDto,
        userId,
      );
    });
  });

  describe('getById', () => {
    it('should return a client by ID', async () => {
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

      jest.spyOn(clientService, 'getClientById').mockResolvedValue(mockClient);

      const result = await clientController.getById(clientId);

      expect(result).toEqual(mockClient);
      expect(clientService.getClientById).toHaveBeenCalledWith(clientId);
    });

    it('should throw NotFoundException if client is not found', async () => {
      jest.spyOn(clientService, 'getClientById').mockResolvedValue(null);

      await expect(clientController.getById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAll', () => {
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

      jest.spyOn(clientService, 'getAllClients').mockResolvedValue({
        total,
        clients: mockClients,
      });

      const result = await clientController.getAll(1, 10);

      expect(result).toEqual({ total, clients: mockClients });
      expect(clientService.getAllClients).toHaveBeenCalledWith(1, 10);
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

      jest.spyOn(clientService, 'getAllClients').mockResolvedValue({
        total,
        clients: mockClients,
      });

      const result = await clientController.getAll();

      expect(result).toEqual({ total, clients: mockClients });
      expect(clientService.getAllClients).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = 'client-id';
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
        salary: 2000,
        companyValue: 15000,
      };

      const mockUpdatedClient: Client = {
        id: clientId,
        name: updateClientDto.name,
        salary: updateClientDto.salary,
        companyValue: updateClientDto.companyValue,
        createdBy: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(clientService, 'updateClient')
        .mockResolvedValue(mockUpdatedClient);

      const result = await clientController.update(clientId, updateClientDto);

      expect(result).toEqual(mockUpdatedClient);
      expect(clientService.updateClient).toHaveBeenCalledWith(
        clientId,
        updateClientDto,
      );
    });

    it('should throw NotFoundException if client is not found', async () => {
      const clientId = 'client-id';
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
        salary: 2000,
        companyValue: 15000,
      };

      jest
        .spyOn(clientService, 'updateClient')
        .mockRejectedValue(new NotFoundException());

      await expect(
        clientController.update(clientId, updateClientDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a client', async () => {
      const clientId = 'client-id';

      jest.spyOn(clientService, 'deleteClient').mockResolvedValue();

      await clientController.delete(clientId);

      expect(clientService.deleteClient).toHaveBeenCalledWith(clientId);
    });

    it('should throw NotFoundException if client is not found', async () => {
      const clientId = 'client-id';

      jest
        .spyOn(clientService, 'deleteClient')
        .mockRejectedValue(new NotFoundException());

      await expect(clientController.delete(clientId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
