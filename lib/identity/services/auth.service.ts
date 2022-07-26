import jwt from 'jsonwebtoken';
import { ICryptoService } from '../../common/services/crypto.service';
import { UserEmailNotFoundError } from '../errors/user-email-not-found.error';
import { UserPasswordIncorrectError } from '../errors/user-password-incorrect.error';
import { IUserRepository, UserEntity } from '../repositories/user.repository';
import { IPasswordService } from './password.service';

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  accessToken: string;
}

export interface IAuthService {
  authenticateByEmailPassword(credentials: AuthenticateUserDTO): Promise<TokenDTO>;
}

export class AuthService implements IAuthService {
  constructor(
    readonly userRepository: IUserRepository,
    readonly passwordService: IPasswordService,
    readonly cryptoService: ICryptoService,
  ) {}

  async authenticateByEmailPassword(credentials: AuthenticateUserDTO): Promise<TokenDTO> {
    const { email, password } = credentials;
    const userByEmail = await this.userRepository.findByEmail(email);

    if (!userByEmail) {
      throw new UserEmailNotFoundError(email);
    }

    const isPasswordValid = await this.passwordService.verify(password, userByEmail.password);

    if (!isPasswordValid) {
      throw new UserPasswordIncorrectError();
    }

    return await this.generateTokenFor(userByEmail);
  }

  async generateTokenFor(user: UserEntity): Promise<TokenDTO> {
    // TODO: Improve authentication security
    const accessToken = jwt.sign({ id: user.id }, 'loh');

    return { accessToken };
  }
}
