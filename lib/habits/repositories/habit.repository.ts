import { Knex } from 'knex';
import { CreateEntityParams, IBaseRepository } from '../../common/repositories/base.repository';

export enum HabitCategory {
  ESSENTIAL = 1,
  IMPACTFUL = 2,
  NON_IMPACTFUL = 3,
}

export interface HabitEntity {
  id: number;
  title: string;
  category: HabitCategory;
  owner_id: number;
}

export interface HabitWithActiveGoal {
  id: number;
  title: string;
  category: HabitCategory;
  owner_id: number;
  goal_amount: string;
  goal_interval: number;
}

export interface IHabitRepository extends IBaseRepository<HabitEntity> {
  findByOwnerId(ownerId: number): Promise<HabitWithActiveGoal[]>;
}

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

  public findByOwnerId(ownerId: number): Promise<HabitWithActiveGoal[]> {
    return this.knex
      .select({
        id: 'habits.id',
        title: 'habits.title',
        category: 'habits.category',
        owner_id: 'habits.owner_id',
        goal_amount: 'habit_goals.amount',
        goal_interval: 'habit_goals.interval',
      })
      .from('habits')
      .leftJoin('habit_goals', 'habits.id', 'habit_goals.habit_id')
      .where('owner_id', ownerId)
      .orderBy(['category', 'title'])
      .then();
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
