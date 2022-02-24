var express = require("express");
var router = express.Router();
const zomato = require("zomato");
const ZomatoService = require("../services/zomato");
const Services = new ZomatoService();

// zomato user key
const client = zomato.createClient({
  userKey: process.env.ZOMATO_CLIENT_KEY,
});

// get zomato data
router.post("/z", async (req, res) => {
  let name = req.body.search;
  await Services.getDataByLocation(name)
    .then((data) => {
      console.log(data, "r data");
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/locations", async (req, res) => {
  let name = req.body.search;
  client.getLocations({ query: name }, (err, result) => {
    if (!err) {
      let main_data = JSON.parse(result).location_suggestions;

      let latitude = JSON.stringify(main_data[0].latitude);
      let longitude = JSON.stringify(main_data[0].longitude);
      client.getGeocode({ lat: latitude, lon: longitude }, (err, result) => {
        if (!err) {
          let data = JSON.parse(result).nearby_restaurants;
          let data_list = [];
          for (var i of data) {
            var Dict = {
              name: i.restaurant.name,
              address: i.restaurant.location.address,
              average_cost_for_two: i.restaurant.average_cost_for_two,
              price_range: i.restaurant.price_range,
              has_online_delivery: i.restaurant.has_online_delivery,
              cuisines: i.restaurant.cuisines,
              featured_image: i.restaurant.featured_image,
              url: i.restaurant.url,
            };
            data_list.push(Dict);
          }
          //   console.log(data_list);
          res.send(data_list);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
