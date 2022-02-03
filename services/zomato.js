const zomato = require("zomato");

// zomato user key
const client = zomato.createClient({
  userKey: process.env.ZOMATO_CLIENT_KEY,
});

module.exports = class ZomatoService {
  async getDataByLocation(name) {
    console.log(name, "service name");
    let data_list = [];
    // try {
    await client.getLocations({ query: name }, async (err, result) => {
      if (!err) {
        let main_data = JSON.parse(result).location_suggestions;

        let latitude = JSON.stringify(main_data[0].latitude);
        let longitude = JSON.stringify(main_data[0].longitude);
        // console.log(lat);
        // console.log(lon);
        await client.getGeocode(
          { lat: latitude, lon: longitude },
          async (err, result) => {
            if (!err) {
              // console.log(result);
              // res.send(result);
              let data = JSON.parse(result).nearby_restaurants;
              // let data_list = [];
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
              console.log(data_list, "service data");
              // res.send(data_list);
              return await data_list;
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    });
    // } catch (err) {
    //   res.send(err);
    // }
  }
};
