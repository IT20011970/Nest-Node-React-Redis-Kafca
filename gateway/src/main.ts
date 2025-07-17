import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(cors());
  app.use(urlencoded({ limit: '50mb', extended: true }));
  const port = 3000;
  await app.listen(port);
}
bootstrap();
