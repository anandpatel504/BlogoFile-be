exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments().primary();
    table.string("name", 255).notNullable();
    table.string("email", 255).unique().notNullable();
    table.string("password", 255).notNullable();
    table.string("profile_picture");
    table.string("reset_link", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
