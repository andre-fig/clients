import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';

import { LogService } from './log.service';
import { Log } from './entities/log.entity';

@ApiBearerAuth()
@ApiTags('Log')
@UseGuards(AuthGuard)
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiOperation({ summary: 'Get all logs with pagination' })
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
  public async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ total: number; clients: Log[] }> {
    return await this.logService.getAllLogs(page, limit);
  }
}
