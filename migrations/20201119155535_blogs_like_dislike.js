exports.up = function (knex) {
  return knex.schema.createTable("blogs_like_dislike", (table) => {
    table.increments().primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.integer("blog_id").references("id").inTable("blogs");
    table.boolean("like");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("blogs_like_dislike");
};
