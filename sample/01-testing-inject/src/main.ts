import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    await app.listen(3000);
};

void bootstrap();
