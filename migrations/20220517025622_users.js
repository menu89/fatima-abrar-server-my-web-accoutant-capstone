/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users_list', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable()
  })
  .createTable('opening_bank_balances', (table) => {
      table.increments('id').primary();
      table.string('acc_type').notNullable();
      table.string('acc_des').notNullable();
      table.integer('amount').notNullable().defaultTo(0).unsigned();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users_list')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('opening_bank_balances').dropTable('users_list');
};

