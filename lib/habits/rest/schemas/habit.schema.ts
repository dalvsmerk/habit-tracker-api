export const habitSchema = {
  $id: 'habitSchema',
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
};
