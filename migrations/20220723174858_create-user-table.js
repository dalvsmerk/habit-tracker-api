/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .hasTable('users')
    .then(function (exists) {
      if (!exists) {
        return knex.schema
          .createTable('users', function (table) {
            table.increments('id').notNullable().primary();
            table.string('name', 64).nullable();
            table.string('email', 254).notNullable();
            table.string('password', 256).notNullable();
            table.index(['email'], 'idx_email');
          });
      }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
