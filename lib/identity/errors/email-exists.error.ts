import { CodedError } from '../../common/errors/with-code.error';

export class UserEmailExistsError extends CodedError {
  code = 'E_USER_EMAIL_EXISTS';

  constructor(email: string) {
    super(`User with ${email} email already exists`);
  }
}
