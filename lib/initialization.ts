import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from './config';
import { ValidationError } from './common/errors/validation.error';
import { registerIdentityRoutes } from './identity/routes';
import { InternalError } from './common/errors/internal.error';
import { registerDependencies } from './di-container';
import { NotFoundError } from './common/errors/not-found.error';
import { NotAuthorisedError } from './identity/errors/not-authorised.error';

export async function start() {
  const server = fastify({ logger: true });

  const onError = shutdown(server, 1);
  const onClose = shutdown(server, 0);

  process.once('unhandledRejection', onError);
  process.once('uncaughtException', onError);
  process.once('SIGTERM', onClose);
  process.once('SIGINT', onClose);

  const diContainer = registerDependencies(server);

  server.decorateRequest('user', undefined);

  registerIdentityRoutes(server, diContainer);
  server.setErrorHandler(onServerError);
  server.setNotFoundHandler(onNotFoundError);

  try {
    await server.listen({ port: config.server.port });
  } catch (error) {
    onError(error as Error);
  }
}

function shutdown(server: FastifyInstance, code: number) {
  return async function handleShutdownError(err?: Error) {
    if (err) {
      server.log.error({
        ...err,
        message: err.message,
        stack: err.stack,
      });
    }

    await server.close();
    process.exit(code);
  };
}

async function onServerError<E extends FastifyError>(error: E, req: FastifyRequest, res: FastifyReply) {
  if (error.validation) {
    return res.status(400).send({
      success: false,
      error: new ValidationError(error),
    });
  }

  if (error instanceof NotAuthorisedError) {
    return res.status(401).send({
      success: false,
      error,
    });
  }

  req.log.error('Server error', {
    message: (error as Error).message,
    stack: (error as Error).stack,
  });

  return res.status(500).send({
    success: false,
    error: new InternalError(error as Error),
  });
}

async function onNotFoundError(req: FastifyRequest, res: FastifyReply) {
  return res.status(404).send({
    success: false,
    error: new NotFoundError(req.method, req.url),
  });
}
