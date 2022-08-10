import { DiRoute } from '../../../common/rest/routes';
import { UserDoesNotExistError } from '../../errors/user-does-not-exist.error';
import { IUserService } from '../../services/user.service';

export const getMeRoute: DiRoute = (container) => ({
  schema: {
    headers: { $ref: 'bearerAuthHeaderSchema#' },
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
      404: { $ref: 'errorResponseSchema#' },
    },
  },
  async handler(req, res) {
    const userService = container.resolve<IUserService>('userService');

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
