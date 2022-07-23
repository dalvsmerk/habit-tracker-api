import { FastifyReply, FastifyRequest, RouteShorthandOptionsWithHandler } from 'fastify';

export const createUserRoute: RouteShorthandOptionsWithHandler = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
          minLength: 6,
        },
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
              id: {
                type: 'string',
                format: 'uuid',
              },
              name: { type: 'string' },
              email: {
                type: 'string',
                format: 'email',
              },
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
              message: 'string',
              code: 'string',
            },
          },
        },
      },
    },
  },
  handler: (_: FastifyRequest, res: FastifyReply) => {
    res.status(201).send({ success: true });
  },
};
