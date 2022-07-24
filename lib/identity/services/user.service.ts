import { UserEmailExistsError } from '../errors/email-exists.error';
import { IUserRepository, UserEntity } from '../repositories/user.repository';
import { IPasswordService } from './password.service';

export interface SignUpUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface ReadUserDTO {
  id: number;
  name: string;
  email: string;
}

export interface IUserService {
  signUp(userDTO: SignUpUserDTO): Promise<ReadUserDTO>;
}

export class UserService implements IUserService {
  constructor(
    readonly userRepository: IUserRepository,
    readonly passwordService: IPasswordService,
  ) {}

  public async signUp(userDTO: SignUpUserDTO): Promise<ReadUserDTO> {
    const { email } = userDTO;
    const userWithEmail = await this.userRepository.findByEmail(email);

    if (userWithEmail) {
      throw new UserEmailExistsError(email);
    }

    const userEntity: Omit<UserEntity, 'id'> = {
      name: userDTO.name,
      email: userDTO.email,
      password: await this.passwordService.encode(userDTO.password),
    };

    return await this.userRepository.create(userEntity);
  }
}
