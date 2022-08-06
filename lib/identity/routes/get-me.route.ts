import { AwilixContainer } from 'awilix';
import { RouteShorthandOptionsWithHandler } from 'fastify';
import { UserDoesNotExistError } from '../errors/user-does-not-exist.error';
import { authorise } from '../pre-handlers/authorise';
import { IUserService } from '../services/user.service';

export const getMe = (diContainer: AwilixContainer): RouteShorthandOptionsWithHandler => ({
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [true] },
          data: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
            },
          },
        },
      },
      '4xx': {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [false] },
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      }
    },
  },
  preHandler: authorise(diContainer),
  async handler(req, res) {
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
