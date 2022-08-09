import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { errorResponseSchema } from '../../../common/rest/schemas/error-response.schema';
import { authorise } from '../../../identity/rest/pre-handlers/authorise';
import { bearerAuthHeaderSchema } from '../../../identity/rest/schemas/bearer-auth-header.schema';
import { createHabitRoute } from './create-habit.route';

export const registerHabitsRoutes = (server: FastifyInstance, diContainer: AwilixContainer) => {
  server.register((instance, _, done) => {
    instance.addSchema(errorResponseSchema);
    instance.addSchema(bearerAuthHeaderSchema);

    instance.addHook('preHandler', authorise(diContainer));
    instance.post('/habit', createHabitRoute(diContainer));

    done();
  }, { prefix: '/api/v1' });
};
