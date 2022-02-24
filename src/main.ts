import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import fs from 'fs'

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // await app.listen(3000);

  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.key'),
    cert: fs.readFileSync('./secrets/public-certificate.crt'),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  await app.listen(3000);
}


bootstrap();
