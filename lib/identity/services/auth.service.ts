import { ICacheService } from '../../common/services/cache.service';
import { ICryptoService } from '../../common/services/crypto.service';
import { IConfig } from '../../config';
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
  sub: string;
  iat: number;
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
    readonly cacheService: ICacheService,
    readonly configService: IConfig,
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
      this.configService.session.jwt.cache.pattern(userByEmail.id),
      token.accessToken,
      this.configService.session.jwt.cache.ttl,
    );

    return token;
  }

  public async verifyToken(tokenDTO: TokenDTO): Promise<boolean> {
    try {
      const payload = await this.cryptoService.verifyJwt(tokenDTO.accessToken);

      if (!('sub' in payload)) {
        return false;
      }

      const user = await this.userRepository.findById(Number(payload.sub));

      if (user) {
        const cachedAccessToken = this.cacheService.get(
          this.configService.session.jwt.cache.pattern(user.id),
        );

        return !!cachedAccessToken && cachedAccessToken === tokenDTO.accessToken;
      }

      return false;
    } catch {
      return false;
    }
  }

  private async generateTokenFor(user: UserEntity): Promise<TokenDTO> {
    const accessToken = this.cryptoService.signJwt<AccessTokenPayload>({
      sub: user.id.toString(),
      iat: Date.now(),
    });

    return { accessToken };
  }
}
