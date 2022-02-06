const Joi = require("joi");
const { Model } = require("./helper/index");

module.exports = class User extends Model {
  static get tableName() {
    return "users";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string(),
      profile_picture: Joi.string().uri(),
      reset_link: Joi.string.uri(),
      created_at: Joi.date(),
    });
  }
  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
