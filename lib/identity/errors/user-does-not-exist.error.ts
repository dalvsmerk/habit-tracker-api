import { CodedError } from '../../common/errors/coded.error';

export class UserDoesNotExistError extends CodedError {
  code = 'E_USER_DOES_NOT_EXIST';

  constructor(id: number) {
    super(`User with ID ${id} does not exist`);
  }
}
