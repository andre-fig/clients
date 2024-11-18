import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dtos/create-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  public async createLog(createLogDto: CreateLogDto): Promise<Log> {
    const client = this.logRepository.create(createLogDto);

    return await this.logRepository.save(client);
  }

  public async getAllLogs(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ total: number; clients: Log[] }> {
    const [clients, total] = await this.logRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        timestamp: 'DESC',
      },
    });

    return { total, clients };
  }
}
