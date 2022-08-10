import { IHabitLogEntryRepository } from '../repositories/habit-log-entry.repository';

export interface CreateHabitLogEntryDTO {
  habit_id: number;
  created_at: string;
}

export interface ReadHabitLogEntryDTO {
  id: number;
  habit_id: number;
  created_at: string;
}

export interface IHabitLogService {
  enterLog(habigLogDTO: CreateHabitLogEntryDTO): Promise<ReadHabitLogEntryDTO>;
}

export class HabitLogService implements IHabitLogService {
  constructor(readonly habitLogEntryRepository: IHabitLogEntryRepository) {}

  public async enterLog(habitLogDTO: CreateHabitLogEntryDTO): Promise<ReadHabitLogEntryDTO> {
    return await this.habitLogEntryRepository.create({
      created_at: habitLogDTO.created_at,
      habit_id: habitLogDTO.habit_id,
    });
  }
}
