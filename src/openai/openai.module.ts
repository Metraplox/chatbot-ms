import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [OpenAIService],
    controllers: [OpenAIController],
})
export class OpenAIModule {}
