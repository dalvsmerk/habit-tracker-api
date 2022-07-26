import { CodedError } from '../../common/errors/with-code.error';

export class InvalidUserCredentialsError extends CodedError {
  code = 'E_INVALID_USER_CREDENTIALS';

  constructor(email: string) {
    super(`Credentials for user with ${email} email are incorrect`);
  }
}
