/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    table.enu('type', ['deposit', 'transfer']).notNullable();
    table.decimal('amount', 14, 2).notNullable();
    table.enu('status', ['pending', 'completed', 'failed']).notNullable();
    table.string('reference').notNullable().unique();
    table.json('metadata');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
