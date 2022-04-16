const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const BlogService = require("../services/blogs");
const GalleryService = require("../services/gallery");
const GServices = new GalleryService();
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
router.post("/uploadPhoto", authenticateToken, (req, res) => {
  const userId = req.decode.id;
  if (!req.files) {
    return res
      .status(400)
      .send({ status: "error", message: "No files were uploaded." });
  }
  // collected image from a user
  const data = req.files.myimage.tempFilePath;
  // console.log(req.files.myimage.tempFilePath);

  // upload image here
  cloudinary.uploader
    .upload(data)
    .then(async (result) => {
      const url = result.url;
      await GServices.uploadPhoto(userId, url);
      res.status(200).send({
        status: "success",
        result,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: "failure",
        error,
      });
    });
});

// get all photos
router.get("/photos", authenticateToken, async (req, res) => {
  const userId = req.decode.id;
  await GServices.findAll(userId)
    .then((data) => {
      data = data.map((d) => {
        d.c_user_id = req.decode.id;
        return d;
      });
      res.send(data);
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
