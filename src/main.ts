import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';
import cookieParser from 'cookie-parser';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  await app.listen(3000);
  Logger.log(`Server started running on http://localhost:3000`, 'Bootstrap');
}
bootstrap();
