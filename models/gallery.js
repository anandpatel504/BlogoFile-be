const Joi = require("joi");
const { Model } = require("./helper/index");
module.exports = class Gallery extends Model {
  static get tableName() {
    return "gallery";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      user_id: Joi.integer(),
      url: Joi.string(),
      created_at: Joi.date(),
      updated_at: Joi.date(),
    });
  }
  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
