'use strict';
module.exports = function(app) {
  var house = require('../controllers/House.js');
  var user = require('../controllers/User.js');
  var service = require('../controllers/Service.js');

  // House
  app.route('/House/Floors')
    .get(house.number_of_floors);
  app.route('/House/Rooms')
    .get(house.list_all_rooms);
  app.route('/House/Rooms/:floor')
    .get(house.list_floor);


  // Doors
  app.route('/House/Doors')
    .get(house.list_all_doors);
  app.route('/House/Doors/:id')
    .get(house.show_door)
    .post(house.update_door);


  // Heater
  app.route('/House/Heater')
    .get(house.list_all_heater);
  app.route('/House/Heater/:room')
    .get(house.show_heater)
    .post(house.update_heater);


  // Light
  app.route('/House/Light')
    .get(house.list_all_lights)
    .post(house.update_light);
  app.route('/Housea/Light/:room')
    .get(house.show_lights);
  app.route('/House/Light/Show/:id')
    .get(house.show_one_light);
  app.route('/House/Light/Color')
    .post(house.update_light_color);
  app.route('/House/Light/Bright')
    .post(house.update_light_brightness);


  // User
  app.route('/User')
    .get(user.get_all_users);
  app.route('/User/new')
    .post(user.add_user);
  app.route('/User/edit')
    .post(user.edit_user);
  app.route('/User/:id')
    .get(user.get_user);
  app.route('/User/delete/:id')
    .get(user.del_user);


  // Service
  app.route('/Service')
    .get(service.get_booked_services);
  app.route('/Service/new')
    .post(service.book_service);
  app.route('/Service/edit')
    .post(service.edit_booked_service);
  app.route('/Service/cancel/:id')
    .get(service.cancel_booked_service);
  app.route('/Service/:id')
    .get(service.get_booked_service);
};
