import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export const createUserRoute: RouteOptions = {
  method: 'POST',
  url: '/v1/user',
  schema: {
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
        },
      },
    },
  },
  handler: (_: FastifyRequest, res: FastifyReply) => {
    res.status(201).send({ success: true });
  },
};
