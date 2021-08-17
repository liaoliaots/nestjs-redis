export const configuration = (): Configuration => ({
    redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD
    }
});

export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
}

export interface Configuration {
    redis: RedisConfig;
}
