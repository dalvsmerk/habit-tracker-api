/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .hasTable('habit_log_entries')
    .then(function (exists) {
      if (!exists) {
        return knex.schema
          .createTable('habit_log_entries', function (table) {
            table.increments('id').notNullable().primary();
            table.datetime('created_at').notNullable();
            table.integer('habit_id').unsigned().notNullable().references('id').inTable('habits');
          });
      }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('habit_log_entries');
};
