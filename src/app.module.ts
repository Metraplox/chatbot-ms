import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    OpenAIModule,
  ],
})
export class AppModule {}
