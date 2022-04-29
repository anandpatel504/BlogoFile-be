const Joi = require("joi");
const { Model } = require("./helper/index");
module.exports = class Blogs extends Model {
  static get tableName() {
    return "blogs";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      user_id: Joi.integer(),
      title: Joi.text().required(),
      description: Joi.text(),
      author: Joi.text(),
      created_at: Joi.date(),
      updated_at: Joi.date(),
    });
  }
  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
