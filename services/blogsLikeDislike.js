const { andWhereNot } = require("../config/dbConfig");
const BlogsLikeDislike = require("../models/blogsLikeDislike");
const Users = require("../models/user");

module.exports = class BlogsLikeDislikeService {
  async createLikeAndDislike(blogsData) {
    const user = await BlogsLikeDislike.query().findOne({
      user_id: blogsData.user_id,
    });
    if (user == undefined) {
      return await BlogsLikeDislike.query().insertGraph(blogsData);
    }
    // if blog_id is exist in the db
    const blog_id = await BlogsLikeDislike.query().where({
      blog_id: blogsData.blog_id,
    });

    if (blog_id.length > 0) {
      return await BlogsLikeDislike.query()
        .update({
          user_id: blogsData.user_id,
          blog_id: blogsData.blog_id,
          like: blogsData.like,
        })
        .where({ user_id: blogsData.user_id })
        .andWhere({ blog_id: blogsData.blog_id });
    } else {
      return await BlogsLikeDislike.query().insert({
        user_id: blogsData.user_id,
        blog_id: blogsData.blog_id,
        like: blogsData.like,
      });
    }
  }

  async findAllLikes(like) {
    // return await LikeDislike.query(like).where({like: "true"});
    const likes = await BlogsLikeDislike.query()
      .where("like", "true")
      .withGraphFetched("users");
    // console.log(likes, likes[0].users.password, "service likes")
    return likes;
  }

  async findAllDislikes(dislike) {
    // return await LikeDislike.query(dislike).where({ dislike: "true" });
    const dislikes = await BlogsLikeDislike.query()
      .where("dislike", "true")
      .withGraphFetched("users");
    return dislikes;
  }
};
