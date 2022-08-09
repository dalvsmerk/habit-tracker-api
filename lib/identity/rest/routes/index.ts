import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { errorResponseSchema } from '../../../common/rest/schemas/error-response.schema';
import { authorise } from '../pre-handlers/authorise';
import { bearerAuthHeaderSchema } from '../schemas/bearer-auth-header.schema';
import { createTokenRoute } from './create-token.route';
import { createUserRoute } from './create-user.route';
import { getMeRoute } from './get-me.route';

export const registerIdentityRoutes = (server: FastifyInstance, diContainer: AwilixContainer) => {
  server.register((instance, _, done) => {
    instance.addSchema(errorResponseSchema);
    instance.addSchema(bearerAuthHeaderSchema);

    instance.post('/user', createUserRoute(diContainer));
    instance.post('/token', createTokenRoute(diContainer));

    instance.register((privateInstance, _, done) => {
      privateInstance.addHook('preHandler', authorise(diContainer));
      privateInstance.get('/me', getMeRoute(diContainer));

      done();
    });

    done();
  }, { prefix: '/api/v1' });
};
