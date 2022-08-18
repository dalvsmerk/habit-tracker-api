import { IHabitLogEntryRepository } from '../repositories/habit-log-entry.repository';
import { HabitCategory } from '../repositories/habit.repository';

export interface CreateHabitLogEntryDTO {
  habit_id: number;
  created_at: string;
}

export interface ReadHabitLogEntryDTO {
  id: number;
  habit_id: number;
  created_at: string;
}

export interface DailyHabitLogEntryDTO {
  habit: {
    id: number;
    title: string;
    category: HabitCategory;
  };
  done: boolean;
  created_at: string | null;
  owner_id: number;
}

export interface IHabitLogService {
  enterLog(habigLogDTO: CreateHabitLogEntryDTO): Promise<ReadHabitLogEntryDTO>;
  getLogForToday(today: string, ownerId: number): Promise<DailyHabitLogEntryDTO[]>;
}

export class HabitLogService implements IHabitLogService {
  constructor(readonly habitLogEntryRepository: IHabitLogEntryRepository) {}

  public async enterLog(habitLogDTO: CreateHabitLogEntryDTO): Promise<ReadHabitLogEntryDTO> {
    return await this.habitLogEntryRepository.create({
      created_at: habitLogDTO.created_at,
      habit_id: habitLogDTO.habit_id,
    });
  }

  public async getLogForToday(today: string, ownerId: number): Promise<DailyHabitLogEntryDTO[]> {
    const logs = await this.habitLogEntryRepository.findLogForToday(today, ownerId);

    return logs.map(log => ({
      habit: {
        id: log.habit_id,
        title: log.title,
        category: log.category,
      },
      done: log.done,
      created_at: log.created_at,
      owner_id: log.owner_id,
    }));
  }
}
