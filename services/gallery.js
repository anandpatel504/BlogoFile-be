const Gallery = require("../models/gallery");
const User = require("../models/user");
const ImagesLikeDislike = require("../models/imagesLikeDislike");

module.exports = class GalleryService {
  async uploadPhoto(userId, url) {
    console.log(userId, url, "service hai bhai\n");
    return await Gallery.query().insertGraph({ user_id: userId, url: url });
  }

  async findAll(userId, photos) {
    return await Gallery.query(photos).withGraphFetched(
      // "users",
      "gallery_image_like_dislike"
    );
  }

  async imageLikeAndDislike(galleryData) {
    const user = await ImagesLikeDislike.query().findOne({
      user_id: galleryData.user_id,
    });
    if (user == undefined) {
      return await ImagesLikeDislike.query().insertGraph(galleryData);
    }
    // if image_id is exist in the db
    const image_id = await ImagesLikeDislike.query().where({
      image_id: galleryData.image_id,
    });

    if (image_id.length > 0) {
      return await ImagesLikeDislike.query()
        .update({
          user_id: galleryData.user_id,
          image_id: galleryData.image_id,
          like: galleryData.like,
        })
        .where({ user_id: galleryData.user_id })
        .andWhere({ image_id: galleryData.image_id });
    } else {
      return await ImagesLikeDislike.query().insert({
        user_id: galleryData.user_id,
        image_id: galleryData.image_id,
        like: galleryData.like,
      });
    }
  }
};
