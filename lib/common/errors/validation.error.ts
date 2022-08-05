import { FastifyError } from 'fastify';
import { CodedError } from './coded.error';

export class ValidationError extends CodedError {
  code = 'E_VALIDATION';

  constructor(error: FastifyError) {
    const message = error.validation
      ? error.validation.map(v => v.message).join(', ')
      : 'Validation error';

    super(message);
  }
}
