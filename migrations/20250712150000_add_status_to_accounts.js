/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('accounts', function(table) {
    table.enum('status', ['active', 'inactive', 'suspended']).notNullable().defaultTo('active');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('accounts', function(table) {
    table.dropColumn('status');
  });
};
