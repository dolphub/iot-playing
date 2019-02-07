import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  try {
    const app = await NestFactory.create(ApplicationModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
    console.log('App listening on port 3000');
  } catch (e) {
    console.log('>>Error:', e);
  }
}

bootstrap();