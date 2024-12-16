/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('pixel_state').update({
    x: knex.raw('x * 4'),
    y: knex.raw('y * 4'),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('pixel_state').update({
    x: knex.raw('x / 4'),
    y: knex.raw('y / 4'),
  });
};
