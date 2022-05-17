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
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users_list');
};

/**
samples from codealong 
 exports.up = function(knex) {
    return knex.schema
    .createTable('warehouse', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('position').notNullable().defaultTo('Store Manager');
      table.string('manager').notNullable();
      table.string('address').notNullable();
      table.string('phone').notNullable();
      table.string('email').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('inventory', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table
        .integer('warehouse_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('warehouse')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(0);
      table.string('status').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};
 
exports.down = function(knex) {
    return knex.schema.dropTable('inventory').dropTable('warehouse');
};
*/