import { DiRoute } from '../../../common/rest/routes';
import { CreateHabitLogEntryDTO, IHabitLogService } from '../../services/habit-log.service';

interface CreateHabitLogEntryBody {
  created_at: string;
}

interface CreateHabitLogEntryParams {
  habit_id: string;
}

export const createHabitLogRoute: DiRoute = (container) => ({
  schema: {
    headers: { $ref: 'bearerAuthHeaderSchema#' },
    body: {
      type: 'object',
      properties: {
        created_at: { type: 'string', format: 'date-time' },
      },
      required: ['created_at'],
    },
    params: {
      type: 'object',
      properties: {
        habit_id: { type: 'number' },
      },
      required: ['habit_id'],
    },
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [true] },
          data: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              habit_id: { type: 'number' },
            },
          },
        },
      },
      '4xx': { $ref: 'errorResponseSchema#' },
    },
  },
  async handler (req, res) {
    const habitLogService = container.resolve<IHabitLogService>('habitService');

    const dto: CreateHabitLogEntryDTO = {
      created_at: (req.body as CreateHabitLogEntryBody).created_at,
      habit_id: Number((req.params as CreateHabitLogEntryParams).habit_id),
    };
    const habitLogEntry = await habitLogService.enterLog(dto);

    return res.status(201).send({
      success: true,
      data: habitLogEntry,
    });
  },
});
