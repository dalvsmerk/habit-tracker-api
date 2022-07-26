import { CodedError } from '../../common/errors/with-code.error';

export class UserPasswordIncorrectError extends CodedError {
  code = 'E_USER_PASSWORD_INCORRECT';

  constructor() {
    super('User password is incorrect');
  }
}
