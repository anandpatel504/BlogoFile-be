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

  static get relationMappings() {
    const User = require("./user");
    const GalleryImageLikeDislike = require("./imagesLikeDislike");
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "gallery.user_id",
          to: "users.id",
        },
      },
      galleryImageLikeDislike: {
        relation: Model.HasManyRelation,
        modelClass: GalleryImageLikeDislike,
        join: {
          from: "gallery.id",
          to: "gallery_image_like_dislike.image_id",
        },
      },
    };
  }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
