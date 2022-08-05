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
    try {
      const payload = await this.cryptoService.verifyJwt(tokenDTO.accessToken);

      if (!('sub' in payload)) {
        return false;
      }

      const user = await this.userRepository.findById(Number(payload.sub));

      return !!user;
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
