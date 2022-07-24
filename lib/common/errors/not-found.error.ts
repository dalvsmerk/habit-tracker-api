import { CodedError } from './with-code.error';

export class NotFoundError extends CodedError {
  code = 'E_NOT_FOUND';

  constructor(readonly method: string, readonly path: string) {
    super('Resource is not found');
  }

  toJSON() {
    const result = super.toJSON();

    return {
      ...result,
      method: this.method,
      path: this.path,
    };
  }
}
