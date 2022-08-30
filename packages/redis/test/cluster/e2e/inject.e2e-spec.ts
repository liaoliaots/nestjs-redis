import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { AppModule } from '../src/app.module';

describe('InjectController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await (app.getHttpAdapter().getInstance() as FastifyInstance).ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/inject (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/inject' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toIncludeSameMembers(['PONG', 'PONG']);
  });
});
