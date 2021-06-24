import { Test } from '@nestjs/testing';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { ClusterClients } from '../../lib/cluster/interfaces';
import { CLUSTER_CLIENTS } from '../../lib/cluster/cluster.constants';
import { quitClients } from '../../lib/cluster/common';

let clients: ClusterClients;

let app: NestFastifyApplication;

afterAll(async () => {
    quitClients(clients);

    await app.close();
});

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    }).compile();

    clients = moduleRef.get<ClusterClients>(CLUSTER_CLIENTS);

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await app.getHttpAdapter().getInstance().ready();
});

test('/service/client0 (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/service/client0' });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('PONG');
});

test('/service/default (GET)', async () => {
    const res = await app.inject({ method: 'GET', url: '/service/default' });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe('PONG');
});
