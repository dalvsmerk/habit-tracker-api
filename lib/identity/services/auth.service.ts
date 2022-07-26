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

interface AccessTokenPayload {
  userId: number;
}

export interface IAuthService {
  authenticateByEmailPassword(credentialsDTO: AuthenticateUserDTO): Promise<TokenDTO>;
  verifyToken(tokenDTO: TokenDTO): Promise<boolean>;
}

export class AuthService implements IAuthService {
  constructor(
    readonly userRepository: IUserRepository,
    readonly passwordService: IPasswordService,
    readonly cryptoService: ICryptoService,
  ) {}

  public async authenticateByEmailPassword(credentialsDTO: AuthenticateUserDTO): Promise<TokenDTO> {
    const { email, password } = credentialsDTO;
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

  public async verifyToken(tokenDTO: TokenDTO): Promise<boolean> {
    const verifyAsync = new Promise<AccessTokenPayload>((resolve) => {
      const payload = jwt.verify(tokenDTO.accessToken, 'loh') as AccessTokenPayload;

      resolve(payload);
    });

    const payload = await verifyAsync;
    const user = await this.userRepository.findById(payload.userId);

    return !!user;
  }

  private async generateTokenFor(user: UserEntity): Promise<TokenDTO> {
    // TODO: Improve authentication security
    const accessToken = jwt.sign({ userId: user.id }, 'loh');

    return { accessToken };
  }
}
