import { Knex } from 'knex';
import { CreateEntityParams, IBaseRepository } from '../../common/repositories/base.repository';

export interface HabitLogEntryEntity {
  id: number;
  habit_id: number;
  created_at: string;
}

export interface IHabitLogEntryRepository extends IBaseRepository<HabitLogEntryEntity> {}

export class HabitLogEntryRepository implements IHabitLogEntryRepository {
  constructor(readonly knex: Knex) {}

  public async create(habitLogEntry: CreateEntityParams<HabitLogEntryEntity>): Promise<HabitLogEntryEntity> {
    return this.knex
      .insert(habitLogEntry)
      .into('habit_log_entries')
      .then(() => this.findByCreatedAt(habitLogEntry.created_at));
  }

  private async findByCreatedAt(createdAt: string): Promise<HabitLogEntryEntity> {
    return this.knex
      .select('*')
      .from('habit_log_entries')
      .where('created_at', createdAt)
      .then();
  }
}
