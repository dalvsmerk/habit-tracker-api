import { CodedError } from '../../common/errors/coded.error';

export class NotAuthorisedError extends CodedError {
  code = 'E_NOT_AUTHORISED';

  constructor() {
    super('Not authorised');
  }
}
