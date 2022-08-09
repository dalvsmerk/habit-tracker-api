import { FastifyError, ValidationResult } from 'fastify';
import { CodedError } from './coded.error';

export class ValidationError extends CodedError {
  code = 'E_VALIDATION';

  constructor(error: FastifyError) {
    const message = error.validation
      ? error.validation.map(ValidationError.validationResultToMessage).join(', ')
      : 'Validation error';

    super(message);
  }

  private static validationResultToMessage(v: ValidationResult) {
    const parameterPath = v.instancePath.replace(/\//g, '.').slice(1);
    const allowedValues = v.params
      ? `: ${v.params[Object.keys(v.params)[0]]}`
      : '';

    return `${parameterPath} ${v.message}${allowedValues}`;
  }
}
