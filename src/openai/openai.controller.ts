import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatbotMSG } from '../common/constants';
import { OpenAIService } from './openai.service';

@Controller('chat')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @MessagePattern(ChatbotMSG.MESSAGE)
  async chat(@Payload() message: string) {
    try {
      return this.openAIService.generateResponse(message);
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error processing message',
        error: error.message,
      };
    }
  }
}
