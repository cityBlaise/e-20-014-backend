import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { typeOrmConfig } from './typeOrm.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  const configService = app.get(ConfigService);

  // Retrieve TypeORM configuration
  const typeOrmConfiguration = await typeOrmConfig(configService);

  // Log TypeORM configuration
  console.log('TypeORM Configuration:', typeOrmConfiguration);
  app.enableCors() 
  const port =process.env.PORT || 2020
  await app.listen(port);
}
bootstrap();
