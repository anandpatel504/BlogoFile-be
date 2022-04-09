const Joi = require("joi");
const { Model } = require("./helper/index");
module.exports = class Blogs extends Model {
  static get tableName() {
    return "blogs";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      title: Joi.string().required(),
      description: Joi.string(),
      user_id: Joi.integer(),
      created_at: Joi.date(),
      updated_at: Joi.date(),
    });
  }
  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
