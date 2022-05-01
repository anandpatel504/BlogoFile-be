const Blogs = require("../models/blogs");
const BlogsLikeDislike = require("../models/blogsLikeDislike");

module.exports = class BlogService {
  async createBlog(blog) {
    return await Blogs.query().insertGraph(blog);
  }

  async updateById(id, blog) {
    const updatedBlog = await Blogs.query().findById(id).patch(blog);
    return updatedBlog;
  }

  async deleteById(blogId) {
    let deleted;
    try {
      let blog_id = await BlogsLikeDislike.query().where("blog_id", blogId);
      if (blog_id !== undefined) {
        deleted = await BlogsLikeDislike.query()
          .delete()
          .where("blog_id", blogId);
      }
      deleted = await Blogs.query().deleteById(blogId);
      return deleted;
    } catch (err) {
      console.log(err, "hello my catch err");
      return err;
    }
  }

  async findAll(txn) {
    try {
      const BlogsData = await Blogs.query(txn).withGraphFetched(
        "blogsLikeDislike"
      );
      return BlogsData;
    } catch (err) {
      return err;
    }
  }

  async findById(blogId) {
    const id = await Blogs.query().findById(blogId);
    if (id == undefined) {
      return { sorry: `blogId ${blogId} not found!` };
    }
    return id;
  }
};
