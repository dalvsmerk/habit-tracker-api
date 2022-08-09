import { AwilixContainer } from 'awilix';
import { preHandlerHookHandler } from 'fastify';
import { NotAuthorisedError } from '../../errors/not-authorised.error';
import { IAuthService } from '../../services/auth.service';

export const authorise = (diContainer: AwilixContainer): preHandlerHookHandler => async (req) => {
  const authorisation = req.headers['authorization'];
  const token = authorisation?.split(/\s/)[1];

  if (!token) {
    throw new NotAuthorisedError();
  }

  const authService = diContainer.resolve<IAuthService>('authService');
  const [valid, user] = await authService.verifyToken({ accessToken: token });

  if (!valid || !user) {
    throw new NotAuthorisedError();
  }

  req.user = user;
};
