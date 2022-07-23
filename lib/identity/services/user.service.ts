import { UserEmailExistsError } from '../errors/email-exists.error';
import { IUserRepository } from '../repositories/user.repository';

interface SignUpUserDTO {
  name: string;
  email: string;
  password: string;
}

interface ReadUserDTO {
  id: number;
  name: string;
  email: string;
}

export interface IUserService {
  signUp(userDTO: SignUpUserDTO): Promise<ReadUserDTO>;
}

export class UserService implements IUserService {
  constructor(readonly userRepository: IUserRepository) {}

  async signUp(userDTO: SignUpUserDTO): Promise<ReadUserDTO> {
    const { email } = userDTO;
    const userWithEmail = await this.userRepository.findByEmail(email);

    if (userWithEmail) {
      throw new UserEmailExistsError(email);
    }

    // TODO: Hash passwords
    return await this.userRepository.create(userDTO);
  }
}
