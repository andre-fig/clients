import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Client } from './entities/client.entity';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully.',
  })
  @Post()
  public async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return await this.clientService.createClient(createClientDto);
  }

  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the client', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Client retrieved successfully.',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Get(':id')
  public async getClientById(@Param('id') id: string): Promise<Client> {
    const client = await this.clientService.getClientById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  @ApiOperation({ summary: 'Get all clients with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of clients per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully.',
  })
  @Get()
  public async getAllClients(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ total: number; clients: Client[] }> {
    return await this.clientService.getAllClients(page, limit);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the client to update',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Patch(':id')
  public async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientService.updateClient(id, updateClientDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the client to delete',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Client deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Delete(':id')
  public async deleteClient(@Param('id') id: string): Promise<void> {
    return await this.clientService.deleteClient(id);
  }
}
