/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    knex.schema
      .hasTable('habits')
      .then(function (exists) {
        if (!exists) {
          return knex.schema
            .createTable('habits', function (table) {
              table.increments('id').notNullable().primary();
              table.string('title', 50).notNullable();
              table.tinyint('category', 1).notNullable();
              table.integer('owner_id').unsigned().notNullable().references('id').inTable('users');
            });
        }
      }),
    knex.schema
      .hasTable('habit_goals')
      .then(function (exists) {
        if (!exists) {
          return knex.schema
            .createTableIfNotExists('habit_goals', function (table) {
              table.increments('id').notNullable().primary();
              table.string('amount', 310).notNullable(); // max 10 times per day monthly
              table.tinyint('interval', 1).notNullable();
              table.integer('habit_id').unsigned().notNullable().references('id').inTable('habits');
            });
        }
      }),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('habits'),
    knex.schema.dropTableIfExists('habit_goals'),
  ]);
};
