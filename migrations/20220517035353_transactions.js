/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('actual_transactions', (table) => {
      table.increments('id').primary;
      table
        .integer('amount')
        .notNullable()
        .defaultTo(0)
        .unsigned();
      table.string('Debit').notNullable();
      table.string('Credit').notNullable();
      table.string('Description');
      table.timestamp('Record_timestamp').notNullable();
      table.timestamp('Transaction_timestamp').notNullable();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users_list')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
  })
  .createTable('budget_entries', (table) => {
    table.increments('id').primary;
    table
      .integer('amount')
      .notNullable()
      .defaultTo(0)
      .unsigned();
    table.string('Debit').notNullable();
    table.string('Credit').notNullable();
    table.string('Description');
    table.timestamp('Transaction_timestamp').notNullable();
    table.boolean('mandatory').defaultTo(false);
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
  return knex.schema.dropTable('budget_entries').dropTable('actual_transactions')
};
