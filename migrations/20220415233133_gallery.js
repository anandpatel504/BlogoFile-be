exports.up = function (knex) {
  return knex.schema.createTable("gallery", (table) => {
    table.increments().primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.string("url", 255).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("gallery");
};
