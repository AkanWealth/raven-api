/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('transactions', function(table) {
    table.enu('type', ['deposit', 'withdrawal', 'transfer']).notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('transactions', function(table) {
    table.enu('type', ['deposit', 'transfer']).notNullable().alter();
  });
};
