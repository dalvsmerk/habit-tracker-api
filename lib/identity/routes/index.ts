import { FastifyInstance } from 'fastify';
import { createUserRoute } from './create-user';

export const registerIdentityRoutes = (server: FastifyInstance) => {
  return server.route(createUserRoute);
};
