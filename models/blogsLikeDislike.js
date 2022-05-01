const Joi = require("joi");
const { Model } = require("./helper/index");

module.exports = class BlogsLikeDislike extends Model {
  static get tableName() {
    return "blogs_like_dislike";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      user_id: Joi.number().required(),
      blog_id: Joi.number(),
      like: Joi.boolean(),
      created_at: Joi.date(),
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
