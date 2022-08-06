import { FastifyError } from 'fastify';
import { CodedError } from './with-code.error';

export class ValidationError extends CodedError {
  code = 'E_VALIDATION';

  constructor(error: FastifyError) {
    super(error.validation ? error.validation[0].message : 'Validation error');
  }
}
