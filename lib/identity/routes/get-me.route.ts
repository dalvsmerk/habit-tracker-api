import { AwilixContainer } from 'awilix';
import { RouteShorthandOptionsWithHandler } from 'fastify';
import { InternalError } from '../../common/errors/internal.error';
import { UserDoesNotExistError } from '../errors/user-does-not-exist.error';
import { authorise } from '../pre-handlers/authorise';
import { IUserService } from '../services/user.service';

export const getMe = (diContainer: AwilixContainer): RouteShorthandOptionsWithHandler => ({
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
  },
  preHandler: authorise(diContainer),
  async handler(req, res) {
    if (!req.user) {
      throw new InternalError(new Error('Request is not decorated with user'));
    }

    const userService = diContainer.resolve<IUserService>('userService');

    try {
      const me = await userService.findById(req.user.id);

      return res.status(200).send({
        success: true,
        data: me,
      });
    } catch (error) {
      if (error instanceof UserDoesNotExistError) {
        return res.status(404).send({
          success: false,
          error,
        });
      }

      throw error;
    }
  },
});
