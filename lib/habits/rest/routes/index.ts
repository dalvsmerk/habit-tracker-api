import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { errorResponseSchema } from '../../../common/rest/schemas/error-response.schema';
import { authorise } from '../../../identity/rest/pre-handlers/authorise';
import { bearerAuthHeaderSchema } from '../../../identity/rest/schemas/bearer-auth-header.schema';
import { habitSchema } from '../schemas/habit.schema';
import { createHabitLogRoute } from './create-habit-log.route';
import { createHabitRoute } from './create-habit.route';
import { getDailyHabitLog } from './get-daily-habit-log.route';
import { getHabitsRoute } from './get-habits.route';

export const registerHabitsRoutes = (server: FastifyInstance, diContainer: AwilixContainer) => {
  server.register((instance, _, done) => {
    instance.addSchema(errorResponseSchema);
    instance.addSchema(bearerAuthHeaderSchema);
    instance.addSchema(habitSchema);

    instance.addHook('preHandler', authorise(diContainer));
    instance.post('/habit', createHabitRoute(diContainer));
    instance.get('/habits', getHabitsRoute(diContainer));
    instance.post('/habit/:habit_id/log', createHabitLogRoute(diContainer));
    instance.get('/habit-log/daily/:today', getDailyHabitLog(diContainer));

    done();
  }, { prefix: '/api/v1' });
};
