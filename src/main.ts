import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { expressMiddleware as rTracer } from 'cls-rtracer';
import { requestLogger } from './common/middlewares/request-logger.middleware';
import { MyLogger } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.enableCors();
  app.use(cookieParser());
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(rTracer());
  app.use(requestLogger);

  const options = new DocumentBuilder()
    .setTitle('Personal Area')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(config.get<number>('port'));

  app.useLogger(new MyLogger(['log', 'error', 'warn', 'debug', 'verbose']));
}
bootstrap();
