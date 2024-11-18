import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LogService } from '../log.service';

@Processor('logs')
export class LogProcessor extends WorkerHost {
  constructor(private readonly logService: LogService) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    const logData = job.data;

    try {
      await this.logService.createLog(logData);
      console.log(`Log salvo com sucesso: ${job.id}`);
    } catch (error) {
      console.error(`Erro ao salvar log: ${job.id}`, error);
      throw error;
    }
  }
}
