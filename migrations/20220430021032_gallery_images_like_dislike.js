exports.up = function (knex) {
  return knex.schema.createTable("gallery_image_like_dislike", (table) => {
    table.increments().primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.integer("image_id").references("id").inTable("gallery");
    table.boolean("like");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("gallery_image_like_dislike");
};
