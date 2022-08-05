import { ICacheService } from '../../common/services/cache.service';
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
}

export interface IAuthService {
  authenticateByEmailPassword(credentialsDTO: AuthenticateUserDTO): Promise<TokenDTO>;
  verifyToken(tokenDTO: TokenDTO): Promise<[boolean, ReadUserDTO | null]>;
  decodeUser(tokenDTO: TokenDTO): Promise<ReadUserDTO | null>;
}

export class AuthService implements IAuthService {
  constructor(
    readonly userRepository: IUserRepository,
    readonly passwordService: IPasswordService,
    readonly cryptoService: ICryptoService,
    readonly cacheService: ICacheService,
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

    this.cacheService.set(
      this.config.session.jwt.cache.pattern(userByEmail.id),
      token.accessToken,
      this.config.session.jwt.cache.ttl,
    );

    return token;
  }

  public async verifyToken(tokenDTO: TokenDTO): Promise<[boolean, ReadUserDTO | null]> {
    try {
      const user = await this.decodeUser(tokenDTO);

      if (user) {
        const cachedAccessToken = this.cacheService.get(
          this.config.session.jwt.cache.pattern(user.id),
        );

        const tokenValid = !!cachedAccessToken && cachedAccessToken === tokenDTO.accessToken;

        return [tokenValid, user];
      }

      return [false, null];
    } catch {
      return [false, null];
    }
  }

  public async decodeUser(tokenDTO: TokenDTO): Promise<ReadUserDTO | null> {
    const payload = await this.cryptoService.verifyJwt(tokenDTO.accessToken);

    if (!('sub' in payload)) {
      return null;
    }

    return await this.userRepository.findById(Number(payload.sub));
  }

  private async generateTokenFor(user: UserEntity): Promise<TokenDTO> {
    const accessToken = this.cryptoService.signJwt<AccessTokenPayload>({
      sub: user.id.toString(),
      iat: Date.now(),
    });

    return { accessToken };
  }
}
