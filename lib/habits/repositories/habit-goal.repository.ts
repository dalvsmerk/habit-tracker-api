import { Knex } from 'knex';
import { CreateEntityParams, IBaseRepository } from '../../common/repositories/base.repository';

export enum GoalInterval {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3
}

export interface HabitGoalEntity {
  id: number;
  habit_id: number;
  interval: GoalInterval;
  /**
   * Amount of repetitions or hours for a goal to be achieved per interval
   * i.e. '3' times 'weekly' or '00:30' hours 'daily'
   */
  amount: string;
}

export interface IHabitGoalRepository extends IBaseRepository<HabitGoalEntity> {}

export class HabitGoalRepository implements IHabitGoalRepository {
  constructor(readonly knex: Knex) {}

  public create(habitGoal: CreateEntityParams<HabitGoalEntity>): Promise<HabitGoalEntity> {
    return this.knex
      .insert(habitGoal)
      .into<HabitGoalEntity>('habit_goals')
      .returning('*')
      // TODO: Remove once SQLite is not used anymore (it doesn't support RETURNING clause)
      .then(async () => (await this.findByHabitId(habitGoal.habit_id)) as HabitGoalEntity);
  }

  private async findByHabitId(habitId: number): Promise<HabitGoalEntity | null> {
    return this.knex
      .select('*')
      .from<HabitGoalEntity>('habit_goals')
      .where('habit_id', habitId)
      .first()
      .then();
  }
}
