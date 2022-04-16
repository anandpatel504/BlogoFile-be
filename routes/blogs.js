const express = require("express");
const router = express.Router();
const BlogService = require("../services/blogs");
const Services = new BlogService();

const { authenticateToken } = require("../auth/strategies/jwt");

// create blog
router.post("/createBlog", authenticateToken, async (req, res) => {
  console.log(req.decode);
  req.body.user_id = req.decode.id;
  console.log(req.body, "mai hu be");
  await Services.createBlog(req.body)
    .then((data) => {
      console.log(req.decode, "data");
      res.send({ status: "success", data: data });
    })
    .catch((err) => {
      res.send(err);
    });
});

// update blog
router.put("/updateBlog/:id", authenticateToken, async (req, res) => {
  const blogId = req.params.id;
  await Services.updateById(blogId, req.body)
    .then((data) => {
      if (data > 0) {
        res.send({ status: `success` });
      } else {
        res.send({ status: `error` });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

// delete blog
router.delete("/deleteBlog/:id", authenticateToken, async (req, res) => {
  const blogId = req.params.id;
  await Services.deleteById(blogId).then((data) => {
    if (data > 0) {
      res.send({ status: 'success' });
    } else {
      res.send({ status: 'error', "message": "Invalid blog id"});
    }
  });
});

// get all blogs
router.get("/getAll", authenticateToken, async (req, res) => {
  console.log(req.decode.id, "blog table");
  await Services.findAll()
    .then((data) => {
      data = data.map((d) => {
        d.c_user_id = req.decode.id;
        return d;
      });
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// get blog by id
router.get("/getBlog/:id", authenticateToken, async (req, res) => {
  const blogId = req.params.id;
  await Services.findById(blogId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
