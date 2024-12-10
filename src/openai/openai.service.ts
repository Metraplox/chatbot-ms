// src/openai/openai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
    private hf: HfInference;
    private readonly logger = new Logger(OpenAIService.name);
    private readonly systemPrompt =
        `Eres Nina, una asistente virtual amable y profesional de nuestra plataforma de cursos en línea.
    
    REGLAS IMPORTANTES:
    1. SIEMPRE habla en español
    2. NUNCA simules ser el usuario o repitas conversaciones ficticias
    3. SIEMPRE da una única respuesta coherente
    4. NUNCA uses palabras en inglés
    5. Mantén un tono profesional pero amigable
    6. Respuestas muy certeras y breves
    
    Ejemplo de respuesta correcta:
    "¡Hola! Soy Nina, tu asistente virtual. ¿En qué puedo ayudarte?"`;

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.get<string>('HUGGINGFACE_TOKEN');
        if (!token) {
            throw new Error('HUGGINGFACE_TOKEN not found in environment variables');
        }
        this.hf = new HfInference(token);
    }

    async generateResponse(prompt: string) {
        try {
            const result = await this.hf.textGeneration({
                model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
                inputs: `Instrucciones: ${this.systemPrompt}\n\nConsulta del usuario: ${prompt}\n\nRespuesta de Nina:`,
                parameters: {
                    max_new_tokens: 150, // Reducido para mantener respuestas concisas
                    temperature: 0.3,    // Reducido para mayor consistencia
                    top_p: 0.8,         // Reducido para respuestas más enfocadas
                    repetition_penalty: 1.5, // Aumentado para evitar repeticiones
                    do_sample: true
                }
            });

            // Limpieza más agresiva de la respuesta
            let cleanResponse = result.generated_text
                .replace(this.systemPrompt, '')
                .replace(/Instrucciones:.*?Respuesta de Nina:/s, '')
                .replace(/Consulta del usuario:.*?\n/s, '')
                .replace(/Usuario:.*?\n/g, '')
                .replace(/Asistente:.*?\n/g, '')
                .replace(/<\|.*?\|>/g, '')
                .replace(prompt, '')
                .trim();

            // Si la respuesta contiene diálogos o es incoherente, usar respuesta por defecto
            if (cleanResponse.includes('Usuario:') ||
                cleanResponse.includes('Asistente:') ||
                cleanResponse.includes('Usual:') ||
                cleanResponse.includes('Certainly')) {
                cleanResponse = "¡Hola! Soy Nina, tu asistente virtual. ¿En qué puedo ayudarte?";
            }

            return {
                response: cleanResponse
            };
        } catch (error) {
            this.logger.error('Error generating response:', error);
            throw error;
        }
    }
}