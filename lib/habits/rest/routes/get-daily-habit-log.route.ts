import { DiRoute } from '../../../common/rest/routes';
import { errorResponseSchema } from '../../../common/rest/schemas/error-response.schema';
import { bearerAuthHeaderSchema } from '../../../identity/rest/schemas/bearer-auth-header.schema';
import { IHabitLogService } from '../../services/habit-log.service';

export const getDailyHabitLog: DiRoute = (container) => ({
  schema: {
    headers: { $ref: bearerAuthHeaderSchema.$id },
    params: {
      type: 'object',
      properties: {
        today: { type: 'string', format: 'date' },
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [true] },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                habit: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    category: { type: 'number', enum: [1, 2, 3] },
                    owner_id: { type: 'number' },
                  }
                },
                created_at: { type: 'string', format: 'date-time' },
                done: { type: 'boolean' },
                owner_id: { type: 'number' },
              }
            },
          },
        },
      },
      400: { $ref: errorResponseSchema.$id },
    },
  },
  async handler(req, res) {
    const habitLogService = container.resolve<IHabitLogService>('habitLogService');
    const { today } = req.params as { today: string };

    const habitLogForToday = await habitLogService.getLogForToday(today, req.user.id);

    return res.status(200).send({
      success: true,
      data: habitLogForToday,
    });
  }
});
