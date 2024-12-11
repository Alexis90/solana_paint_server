/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('account_state', (table)=>{
    table.increments('id')
    table.string('wallet_address').unique()
    table.integer('pixel_used').defaultTo(0)
    table.dateTime('last_updated').defaultTo(knex.fn.now())
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('account_state')
};
