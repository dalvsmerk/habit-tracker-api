import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { createUserRoute } from './create-user.route';

export const registerIdentityRoutes = (server: FastifyInstance, diContainer: AwilixContainer) => {
  server.post('/api/v1/user', createUserRoute(diContainer));
};
