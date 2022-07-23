import { FastifyInstance } from 'fastify';
import { createUserRoute } from './create-user.route';

export const registerIdentityRoutes = (server: FastifyInstance) => {
  server.post('/v1/user', createUserRoute);
  return server;
};
