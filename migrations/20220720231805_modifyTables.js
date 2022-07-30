/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .alterTable('users_list', (table) => {
        table.integer('verification-code')
        table.integer('password-verification-code')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('users_list', (table) => {
        table.dropColumn('verification-code')
        table.dropColumn('password-verification-code')
    })
};
