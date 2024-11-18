import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { LogService } from './log.service';
import { LogProcessor } from './processors/log.processor';
import { Log } from './entities/log.entity';
import { LogQueue } from './queues/log.queue';
import { LogController } from './log.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Log]),
    BullModule.registerQueue({
      name: 'logs',
    }),
  ],
  providers: [LogService, LogProcessor, LogQueue],
  controllers: [LogController],
  exports: [LogService, LogQueue],
})
export class LogModule {}
