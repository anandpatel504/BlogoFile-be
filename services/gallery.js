const Gallery = require("../models/gallery");
const User = require("../models/user");
const ImagesLikeDislike = require("../models/imagesLikeDislike");

module.exports = class GalleryService {
  async uploadPhoto(userId, url) {
    return await Gallery.query().insertGraph({ user_id: userId, url: url });
  }

  async findAll(userId, photos) {
    try {
      const galleryData = await Gallery.query(photos).withGraphFetched(
        "[users, galleryImageLikeDislike]"
      );
      return galleryData;
    } catch (err) {
      return err;
    }
  }

  async deleteImageById(imageId) {
    let deleted;
    try {
      let image_id = await ImagesLikeDislike.query().findById(imageId);
      if (image_id !== undefined) {
        deleted = await ImagesLikeDislike.query()
          .delete()
          .where("image_id", imageId);
      }
      deleted = await Gallery.query().deleteById(imageId);
      return deleted;
    } catch (err) {
      return err;
    }
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
