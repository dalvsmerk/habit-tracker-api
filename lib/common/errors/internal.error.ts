import { CodedError } from './coded.error';

export class InternalError extends CodedError {
  code = 'E_INTERNAL';
  error: Error;

  constructor(error: Error) {
    super(`Internal error: ${error.message}`);
    this.error = error;
  }

  toJSON() {
    const result = super.toJSON();

    return {
      ...result,
      stack: this.error.stack,
    };
  }
}
