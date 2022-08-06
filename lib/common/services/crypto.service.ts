import jwt, { JwtPayload } from 'jsonwebtoken';
import { IConfig } from '../../config';

// const { createHash } = await import('crypto');
const crypto = import('crypto');

export interface ICryptoService {
  hash(buffer: string): Promise<string>;
  signJwt<T extends JwtPayload>(payload: T): string;
  verifyJwt<T extends JwtPayload>(token: string): Promise<T>;
}

export class CryptoService implements ICryptoService {
  constructor (readonly config: IConfig) {}

  public async hash(buffer: string): Promise<string> {
    const { createHash } = await crypto;

    return createHash('sha256').update(buffer).digest('hex');
  }

  public signJwt<T extends JwtPayload>(payload: T): string {
    return jwt.sign(payload, this.config.secrets.jwt);
  }

  public async verifyJwt<T extends jwt.JwtPayload>(token: string): Promise<T> {
    const verifyAsync = new Promise<T>((resolve, reject) => {
      const payload = jwt.verify(token, this.config.secrets.jwt) as T;

      if (!payload || !Object.keys(payload).length) {
        reject();
      }

      resolve(payload);
    });

    return await verifyAsync as T;
  }
}
