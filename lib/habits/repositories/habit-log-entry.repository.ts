import { Knex } from 'knex';
import { CreateEntityParams, IBaseRepository } from '../../common/repositories/base.repository';
import { HabitCategory } from './habit.repository';

export interface HabitLogEntryEntity {
  id: number;
  habit_id: number;
  created_at: string;
}

export interface DailyHabitLogEntity {
  habit_id: number;
  title: string;
  created_at: string | null;
  done: boolean;
  owner_id: number;
  category: HabitCategory;
}

export interface FindLogForTodayQueryResult {
  habit_id: number;
  owner_id: number;
  title: string;
  category: HabitCategory;
  created_at: string;
}

export interface IHabitLogEntryRepository extends IBaseRepository<HabitLogEntryEntity> {
  findLogForToday(today: string, ownerId: number): Promise<DailyHabitLogEntity[]>;
}

export class HabitLogEntryRepository implements IHabitLogEntryRepository {
  constructor(readonly knex: Knex) {}

  public async create(habitLogEntry: CreateEntityParams<HabitLogEntryEntity>): Promise<HabitLogEntryEntity> {
    return this.knex
      .insert(habitLogEntry)
      .into('habit_log_entries')
      .then(() => this.findByCreatedAt(habitLogEntry.created_at));
  }

  public async findLogForToday(today: string, ownerId: number): Promise<DailyHabitLogEntity[]> {
    const logs: FindLogForTodayQueryResult[] = await this.knex
      .select({
        habit_id: 'habits.id',
        owner_id: 'habits.owner_id',
        title: 'habits.title',
        category: 'habits.category',
        created_at: 'habit_log_entries.created_at',
      })
      .from('habits')
      .leftJoin('habit_log_entries', 'habits.id', 'habit_log_entries.habit_id')
      .where('habits.owner_id', ownerId)
      .orderBy('created_at', 'desc')
      .then();

    return logs.map(log => ({
      habit_id: log.habit_id,
      owner_id: log.owner_id,
      title: log.title,
      category: log.category,
      created_at: log.created_at,
      done: !!log.created_at,
    }));
  }

  private async findByCreatedAt(createdAt: string): Promise<HabitLogEntryEntity> {
    return this.knex
      .select('*')
      .from('habit_log_entries')
      .where('created_at', createdAt)
      .then();
  }
}
