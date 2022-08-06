import { ICryptoService } from '../../common/services/crypto.service';

export interface IPasswordService {
  encode(password: string): Promise<string>;
  verify(password: string, encoded: string): Promise<boolean>;
}

export class PasswordService implements IPasswordService {
  constructor(readonly cryptoService: ICryptoService) {}

  public async encode(password: string): Promise<string> {
    return await this.cryptoService.hash(password);
  }

  public async verify(password: string, encoded: string): Promise<boolean> {
    return (await this.encode(password)) === encoded;
  }
}
