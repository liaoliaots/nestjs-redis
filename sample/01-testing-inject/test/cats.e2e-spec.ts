import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CatsModule } from '../src/cats/cats.module';

describe('Cats', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CatsModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });
});
