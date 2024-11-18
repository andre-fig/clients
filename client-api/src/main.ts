import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { validateEnvVars } from './config/setup';
import { BullBoardService } from './config/bull-board.service';

async function bootstrap() {
  validateEnvVars();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('URL Shortener Service')
    .setDescription('URL Shortening API')
    .addServer('http://localhost:8000')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('admin/docs', app, document);

  // Bull Board Configuration
  const bullBoardService = app.get(BullBoardService);
  await bullBoardService.setupBullBoard(app);

  // Start the application
  await app.listen(3000);
}
bootstrap();
