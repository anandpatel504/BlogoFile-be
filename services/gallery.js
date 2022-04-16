const Gallery = require("../models/gallery");
const User = require("../models/user");

module.exports = class GalleryService {
  async uploadPhoto(userId, url) {
    console.log(userId, url, "service hai bhai\n");
    return await Gallery.query().insertGraph({ user_id: userId, url: url });
  }

  async findAll(userId, photos) {
    return await Gallery.query(photos);
  }
};
