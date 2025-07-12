/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('transactions', function(table) {
    // First drop the existing enum constraint
    knex.raw('ALTER TABLE transactions MODIFY COLUMN status ENUM("pending", "completed", "failed", "success") NOT NULL').then();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('transactions', function(table) {
    knex.raw('ALTER TABLE transactions MODIFY COLUMN status ENUM("pending", "completed", "failed") NOT NULL').then();
  });
};
