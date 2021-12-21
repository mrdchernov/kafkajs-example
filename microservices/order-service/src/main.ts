import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<TcpOptions>(AppModule, {
    transport: Transport.TCP,
    options: { port: +process.env.TCP_PORT },
  });
  app.enableShutdownHooks();

  await app.listen();
}
bootstrap();
