import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number.parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD ?? ''
}));
