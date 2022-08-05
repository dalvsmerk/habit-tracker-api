import { AwilixContainer } from 'awilix';
import { preHandlerHookHandler } from 'fastify';
import { NotAuthorisedError } from '../errors/not-authorised.error';
import { IAuthService } from '../services/auth.service';

export const authorise = (diContainer: AwilixContainer): preHandlerHookHandler => async (req, res) => {
  const authorisation = req.headers['authorization'];
  const values = authorisation?.split(' ');

  const goodLookingToken =
    values &&
    values.length === 2 &&
    values[0] === 'Bearer' &&
    values[1].length;

  if (goodLookingToken) {
    const token = values[1];
    const authService = diContainer.resolve<IAuthService>('authService');
    const [valid, user] = await authService.verifyToken({ accessToken: token });

    if (valid && user) {
      req.user = user;
    } else {
      throw new NotAuthorisedError();
    }
  } else {
    throw new NotAuthorisedError();
  }
};
