import { AwilixContainer } from 'awilix';
import { RouteShorthandOptionsWithHandler } from 'fastify';
import { CreateHabitDTO, IHabitService } from '../../services/habit.service';

export const createHabitRoute = (container: AwilixContainer): RouteShorthandOptionsWithHandler => ({
  schema: {
    headers: { $ref: 'bearerAuthHeaderSchema#' },
    body: {
      type: 'object',
      required: ['title', 'category'],
      properties: {
        title: { type: 'string', maxLength: 50 },
        category: { type: 'number', enum: [1, 2, 3] },
        goal_amount: {
          type: ['string', 'null'],
          maxLength: 310,
        },
        goal_interval: {
          type: ['number', 'null'],
          enum: [1, 2, 3],
        },
      },
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
              owner_id: { type: 'number' },
              title: { type: 'string' },
              category: { type: 'number', enum: [1, 2, 3] },
              goal_amount: { type: ['string', 'null'] },
              goal_interval: {
                type: ['number', 'null'],
                enum: [1, 2, 3],
              },
            },
          }
        },
      },
      '4xx': { $ref: 'errorResponseSchema#' },
    },
  },
  async handler(req, res) {
    const habitService = container.resolve<IHabitService>('habitService');

    const habitDTO: CreateHabitDTO = {
      ...req.body as CreateHabitDTO,
      owner_id: req.user.id,
    };
    const habit = await habitService.create(habitDTO);

    return res.status(201).send({
      success: true,
      data: habit,
    });
  },
});
