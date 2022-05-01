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

  static get relationMappings() {
    /* eslint-disable global-require */
    const Blogs = require("./blogs");
    /* eslint-enable global-require */

    return {
      blogs: {
        relation: Model.BelongsToOneRelation,
        modelClass: Blogs,
        join: {
          from: "blogs_like_dislike.blog_id",
          to: "blogs.id",
        },
      },
    };
  }

  // static get relationMappings() {
  //   const Blogs = require("./blogs");
  //   return {
  //     blogs: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Blogs,
  //       join: {
  //         from: "blogs_like_dislike.blog_id",
  //         to: "blogs.id",
  //       },
  //     },
  //   };
  // }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};
