import { CodedError } from '../../common/errors/coded.error';

export class UserEmailNotFoundError extends CodedError {
  code = 'E_USER_EMAIL_NOT_FOUND';

  constructor(email: string) {
    super(`User with ${email} email can not be found`);
  }
}
