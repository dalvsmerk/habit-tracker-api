import fastify from 'fastify';
import { config } from './lib/config';
import { registerIdentityRoutes } from './lib/identity/routes';

const server = fastify({ logger: true });

registerIdentityRoutes(server);

const shutdown = (code: number) => (err: Error) => {
    server.log.error(err);
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
