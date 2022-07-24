// const { createHash } = await import('crypto');
const crypto = import('crypto');

export interface ICryptoService {
  hash(buffer: string): Promise<string>;
}

export class CryptoService implements ICryptoService {
  public async hash(buffer: string): Promise<string> {
    const { createHash } = await crypto;

    return createHash('sha256').update(buffer).digest('hex');
  }
}
