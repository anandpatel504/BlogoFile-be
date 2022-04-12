const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const BlogService = require("../services/blogs");
const Services = new BlogService();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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

// image upload API
router.post("/image-upload", (request, response) => {
  if (!request.files) {
    return res.status(400).send("No files were uploaded.");
  }
  // collected image from a user
  const data = request.files.myimage.tempFilePath;
  // console.log(request.files.myimage.tempFilePath);

  // upload image here
  cloudinary.uploader
    .upload(data)
    .then((result) => {
      console.log(result, "result...");
      response.status(200).send({
        message: "success",
        result,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
});

// update blog
router.put("/updateBlog/:id", authenticateToken, async (req, res) => {
  const blogId = req.params.id;
  await Services.updateById(blogId, req.body)
    .then((data) => {
      if (data > 0) {
        res.send({ success: `blog Id ${blogId} updated` });
      } else {
        res.send({ sorry: `blog Id ${blogId} not found!` });
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
      res.send({ success: `blog Id ${blogId} deleted` });
    } else {
      res.send({ sorry: `blog Id ${blogId} not found!` });
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
