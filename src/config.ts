import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  rabbitmq: {
    host: process.env.RABBITMQ_HOST,
    port: parseInt(process.env.RABBITMQ_PORT, 10),
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
  },
}));
