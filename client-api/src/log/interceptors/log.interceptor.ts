import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogQueue } from '../queues/log.queue';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logQueue: LogQueue) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query, user } = request;

    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const log = {
          action: this.getAction(method, url),
          route: url,
          method,
          params,
          query,
          body,
          userId: user?.id || null,
          statusCode: context.switchToHttp().getResponse().statusCode,
          response,
          timestamp: new Date(),
          duration: Date.now() - startTime,
        };

        await this.logQueue.addLog(log);
      }),
    );
  }

  private getAction(method: string, url: string): string {
    if (method === 'POST') return 'create';
    if (method === 'GET' && url.includes(':id')) return 'getById';
    if (method === 'GET') return 'getAll';
    if (method === 'PATCH') return 'update';
    if (method === 'DELETE') return 'delete';
    return 'unknown';
  }
}
