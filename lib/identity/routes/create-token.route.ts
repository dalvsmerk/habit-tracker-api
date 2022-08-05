import { AwilixContainer } from 'awilix';
import { FastifyReply, FastifyRequest, RouteShorthandOptionsWithHandler } from 'fastify';
import { InvalidUserCredentialsError } from '../errors/invalid-user-credentials.error';
import { UserEmailNotFoundError } from '../errors/user-email-not-found.error';
import { UserPasswordIncorrectError } from '../errors/user-password-incorrect.error';
import { AuthenticateUserDTO, IAuthService } from '../services/auth.service';

export const createToken = (container: AwilixContainer): RouteShorthandOptionsWithHandler => ({
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        // TODO: Move to separate schema definition
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
              access_token: { type: 'string' },
            },
          },
        },
      },
      400: {
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
      },
    },
  },
  async handler(req: FastifyRequest, res: FastifyReply) {
    const authService = container.resolve<IAuthService>('authService');
    const credentials = req.body as AuthenticateUserDTO;

    try {
      const { accessToken } = await authService.authenticateByEmailPassword(credentials);

      return res.status(201).send({
        success: true,
        data: {
          access_token: accessToken,
        },
      });
    } catch (error) {
      if (
        error instanceof UserEmailNotFoundError ||
        error instanceof UserPasswordIncorrectError
      ) {
        return res.status(401).send({
          success: false,
          error: new InvalidUserCredentialsError(credentials.email),
        });
      }

      throw error;
    }
  },
});
