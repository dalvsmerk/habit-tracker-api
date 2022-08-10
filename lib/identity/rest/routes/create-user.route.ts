import { DiRoute } from '../../../common/rest/routes';
import { UserEmailExistsError } from '../../errors/email-exists.error';
import { IUserService, SignUpUserDTO } from '../../services/user.service';

export const createUserRoute: DiRoute = (container) => ({
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', minLength: 1 },
        email: {
          type: 'string',
          format: 'email',
          minLength: 3,
        },
        password: { type: 'string', minLength: 6 },
      },
    },
    response: {
      201: {
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
      400: { $ref: 'errorResponseSchema#' },
    },
  },
  async handler(req, res) {
    const userService = container.resolve<IUserService>('userService');

    try {
      const user = await userService.signUp(req.body as SignUpUserDTO);

      return res.status(201).send({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof UserEmailExistsError) {
        return res.status(400).send({
          success: false,
          error: error,
        });
      }

      throw error;
    }
  },
});
