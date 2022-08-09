import { GoalInterval, IHabitGoalRepository } from '../repositories/habit-goal.repository';
import { HabitCategory, IHabitRepository } from '../repositories/habit.repository';

export interface CreateHabitDTO {
  owner_id: number;
  title: string;
  category: HabitCategory;
  goal_amount: string | null;
  goal_interval: GoalInterval | null;
}

export interface ReadHabitDTO {
  id: number;
  owner_id: number;
  title: string;
  category: HabitCategory;
  goal_amount: string | null;
  goal_interval: GoalInterval | null;
}

export interface IHabitService {
  create(habitDTO: CreateHabitDTO): Promise<ReadHabitDTO>;
  findAllFor(ownerId: number): Promise<ReadHabitDTO[]>;
}

export class HabitService implements IHabitService {
  constructor(
    readonly habitRepository: IHabitRepository,
    readonly habitGoalRepository: IHabitGoalRepository,
  ) {}

  public async create(habitDTO: CreateHabitDTO): Promise<ReadHabitDTO> {
    const habit = await this.habitRepository.create({
      title: habitDTO.title,
      category: habitDTO.category,
      owner_id: habitDTO.owner_id,
    });

    const createdHabitDTO: ReadHabitDTO = {
      id: habit.id,
      owner_id: habitDTO.owner_id,
      title: habit.title,
      category: habit.category,
      goal_amount: null,
      goal_interval: null,
    };

    if (habitDTO.goal_amount && habitDTO.goal_interval) {
      const initialGoal = await this.habitGoalRepository.create({
        habit_id: habit.id,
        amount: habitDTO.goal_amount,
        interval: habitDTO.goal_interval,
      });

      createdHabitDTO.goal_amount = initialGoal.amount;
      createdHabitDTO.goal_interval = initialGoal.interval;
    }

    return createdHabitDTO;
  }

  public async findAllFor(ownerId: number): Promise<ReadHabitDTO[]> {
    return await this.habitRepository.findByOwnerId(ownerId);
  }
}
