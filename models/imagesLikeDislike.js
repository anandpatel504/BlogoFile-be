const Joi = require("joi");
const { Model } = require("./helper/index");

module.exports = class ImagesLikeDislike extends Model {
  static get tableName() {
    return "gallery_image_like_dislike";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      user_id: Joi.number().required(),
      blog_id: Joi.number(),
      image_id: Joi.number(),
      like: Joi.boolean(),
      created_at: Joi.date(),
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
