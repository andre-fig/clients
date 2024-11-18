export class CreateLogDto {
  action: string;
  route: string;
  method: string;
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
  userId: string;
  statusCode: number;
  response: Record<string, any>;
  timestamp: Date;
  duration: number;
}
