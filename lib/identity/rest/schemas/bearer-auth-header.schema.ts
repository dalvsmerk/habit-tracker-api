export const bearerAuthHeaderSchema = {
  $id: 'bearerAuthHeaderSchema',
  type: 'object',
  properties: {
    'authorization': {
      type: 'string',
      pattern: '^Bearer\\s[A-Za-z0-9-_]*\\.[A-Za-z0-9-_]*\\.[A-Za-z0-9-_]*$',
    },
  },
  required: ['authorization'],
};
