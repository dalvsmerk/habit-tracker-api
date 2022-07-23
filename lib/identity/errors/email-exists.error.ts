export class UserEmailExistsError extends Error {
  static code = 'E_USER_EMAIL_EXISTS';

  constructor(email: string) {
    super(`User with ${email} email already exists`);
  }
}
