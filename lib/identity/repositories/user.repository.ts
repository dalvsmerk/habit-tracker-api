import { Knex } from 'knex';
import { BaseEntity, IBaseRepository } from '../../common/repositories/base.repository';

export interface UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
}

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id'>): Promise<UserEntity>;
}

export class UserRepository implements IUserRepository {
  constructor(readonly knex: Knex) {}

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.knex
      .select('*')
      .from<UserEntity>('users')
      .where('email', email)
      .first()
      .then();
  }

  public async findById(id: number): Promise<UserEntity | null> {
    return this.knex
      .select('*')
      .from<UserEntity>('users')
      .where('id', id)
      .first()
      .then();
  }

  public async create(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    return this.knex
      .insert(user)
      .into('users')
      .returning('*')
      // TODO: Remove once SQLite is not used anymore (it doesn't support RETURNING clause)
      .then(async () => (await this.findByEmail(user.email)) as UserEntity);
  }
}
