import fastify from 'fastify';
import { config } from './lib/config';

const server = fastify({ logger: true });

server.get('/ping', () => 'pong');

const shutdown = (code: number) => () => {
    server.close();
    process.exit(code);
};

const start = async () => {
    try {
        await server.listen({ port: config.server.port });
    } catch (error) {
        shutdown(1);
    }
};

process.on('unhandledRejection', shutdown(1));
process.on('uncaughtException', shutdown(1));

start();
