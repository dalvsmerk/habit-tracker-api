import { Knex } from 'knex';
import { BaseEntity, IBaseRepository } from '../../common/repositories/base.repository';

export interface UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
}

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id'>): Promise<UserEntity>;
}

export class UserRepository implements IUserRepository {
  constructor(readonly dbContext: Knex) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return null;
  }

  async create(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    return {};
  }
}
