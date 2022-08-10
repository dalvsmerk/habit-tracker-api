import { DiRoute } from '../../../common/rest/routes';
import { IHabitService } from '../../services/habit.service';

export const getHabitsRoute: DiRoute = (container) => ({
  schema: {
    headers: { $ref: 'bearerAuthHeaderSchema#' },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [true] },
          data: {
            type: 'array',
            items: { $ref: 'habitSchema' },
          },
        },
      },
    },
  },
  async handler(req, res) {
    const habitService = container.resolve<IHabitService>('habitService');
    const habits = await habitService.findAllFor(req.user.id);

    return res.status(200).send({
      success: true,
      data: habits,
    });
  },
});
