exports.up = function (knex) {
  return knex.schema.createTable("like_dislike", (table) => {
    table.increments().primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.boolean("like");
    table.boolean("dislike");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("like_dislike");
};
