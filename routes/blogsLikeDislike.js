const express = require("express");
const router = express.Router();
const BlogsLikeDislikeService = require("../services/blogsLikeDislike");
const Services = new BlogsLikeDislikeService();

const { authenticateToken } = require("../auth/strategies/jwt");

// do like&dislike
router.post("/blogLikeDislike", authenticateToken, async (req, res) => {
  const userId = req.decode.id;
  const like = req.body.like;
  const blog_id = req.body.blog_id;
  const userData = {
    user_id: userId,
    blog_id: blog_id,
    like: like,
  };
  await Services.createLikeAndDislike(userData)
    .then((data) => {
      res.send({ status: "success", data: data });
    })
    .catch((err) => {
      res.send(err);
    });
});

// get likes
router.get("/likes", authenticateToken, async (req, res) => {
  await Services.findAllLikes().then((data) => {
    console.log(data, "route data");
    res.send(data);
  });
});

// get dislikes
router.get("/dislikes", authenticateToken, async (req, res) => {
  await Services.findAllDislikes().then((data) => {
    console.log(data, "route data");
    res.send(data);
  });
});

module.exports = router;
