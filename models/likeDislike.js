const Joi = require("joi");
const { Model } = require("./helper/index");

module.exports = class LikeDislike extends Model {
  static get tableName() {
    return "like_dislike";
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      user_id: Joi.number().required(),
      like: Joi.boolean(),
      dislike: Joi.boolean(),
      created_at: Joi.date(),
      updated_at: Joi.date(),
    });
  }

  static get relationMappings() {
    const Users = require("./user");
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: "like_dislike.user_id",
          to: "users.id",
        },
      },
    };
  }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
