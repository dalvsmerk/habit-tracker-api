import { ICryptoService } from '../../common/services/crypto.service';
import { IConfig } from '../../config';
import { UserEmailNotFoundError } from '../errors/user-email-not-found.error';
import { UserPasswordIncorrectError } from '../errors/user-password-incorrect.error';
import { IUserRepository, UserEntity } from '../repositories/user.repository';
import { IPasswordService } from './password.service';
import { ReadUserDTO } from './user.service';

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  accessToken: string;
}

interface AccessTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface IAuthService {
  authenticateByEmailPassword(credentialsDTO: AuthenticateUserDTO): Promise<TokenDTO>;
  verifyToken(tokenDTO: TokenDTO): Promise<[boolean, ReadUserDTO | null]>;
}

export class AuthService implements IAuthService {
  static VALID_JWT_PAYLOAD = ['sub', 'iat', 'exp'];

  constructor(
    readonly userRepository: IUserRepository,
    readonly passwordService: IPasswordService,
    readonly cryptoService: ICryptoService,
    readonly config: IConfig,
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

    const token = await this.generateTokenFor(userByEmail);

    return token;
  }

  public async verifyToken(tokenDTO: TokenDTO): Promise<[boolean, ReadUserDTO | null]> {
    try {
      const payload = await this.cryptoService.verifyJwt<AccessTokenPayload>(tokenDTO.accessToken);
      const validPayload = payload && AuthService.VALID_JWT_PAYLOAD.every(k => k in payload);

      if (!validPayload) {
        return [false, null];
      }

      const expired = Date.now() > payload.exp;

      if (expired) {
        return [false, null];
      }

      const user = await this.userRepository.findById(Number(payload.sub));

      if (user) {
        return [true, user];
      }

      return [false, null];
    } catch {
      return [false, null];
    }
  }

  private async generateTokenFor(user: UserEntity): Promise<TokenDTO> {
    const now = Date.now();

    const accessToken = this.cryptoService.signJwt<AccessTokenPayload>({
      sub: user.id.toString(),
      iat: now,
      exp: now + this.config.session.jwt.ttl,
    });

    return { accessToken };
  }
}
