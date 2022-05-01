exports.up = function (knex) {
  return knex.schema.createTable("blogs", (table) => {
    table.increments().primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.text("title").notNullable();
    table.text("description").notNullable();
    table.text("url").notNullable();
    table.string("author", 255).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("blogs");
};
