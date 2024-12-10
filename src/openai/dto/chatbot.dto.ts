import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class ChatbotDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    prompt: string;
}