import { Knex } from 'knex';
import { CreateEntityParams, IBaseRepository } from '../../common/repositories/base.repository';

export enum HabitCategory {
  IMPACTFUL = 1,
  NON_IMPACTFUL = 2,
  ESSENTIAL = 3
}

export interface HabitEntity {
  id: number;
  title: string;
  category: HabitCategory;
  owner_id: number;
}

export interface IHabitRepository extends IBaseRepository<HabitEntity> {}

export class HabitRepository implements IHabitRepository {
  constructor(readonly knex: Knex) {}

  public create(habit: CreateEntityParams<HabitEntity>): Promise<HabitEntity> {
    return this.knex
      .insert(habit)
      .into('habits')
      .returning('*')
      // TODO: Remove once SQLite is not used anymore (it doesn't support RETURNING clause)
      .then(async () => (await this.findByTitle(habit.title)) as HabitEntity);
  }

  private async findByTitle(title: string): Promise<HabitEntity | null> {
    return this.knex
      .select('*')
      .from<HabitEntity>('habits')
      .where('title', title)
      .first()
      .then();
  }
}
