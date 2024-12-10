import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitMQ } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        "amqp://user:password@localhost:5672"
      ],
      queue: RabbitMQ.ChatbotQueue,
    },
  });

  const logger = new Logger('Main');

  await app.listen();

  logger.log(
      `${process.env.NODE_ENV === 'production' ? 'production' : 'development'} enviroment`,
  );
}
bootstrap();
