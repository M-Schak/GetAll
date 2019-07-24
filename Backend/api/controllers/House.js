'use strict';

const request = require('request-promise');
// Host adress of the CouchDB instance
const host = "http://user:password@host:port";


/*
 * GET /House/Floors
 * Get numbers of lowest and highest floors from database.
 */
exports.number_of_floors = function(req, res) {
  console.log("number_of_floors");

  const options = {
    method: 'POST',
    url: host + '/house/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        _id: { '$gt': "0" }
      },
      fields: [ '_id', 'floor' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var min = 10000;
      var max = -1;
      list.forEach(room => {
        if (parseInt(room.floor) > max) {
          max = parseInt(room.floor);
        }
        if (parseInt(room.floor) < min) {
          min = parseInt(room.floor);
        }
      });
      console.log("Min: " + min + "\nMax: " + max)
      var res_list = {};
      var floor_list = [];
      for (var i = min; i <= max; i++) {
        floor_list.push(i);
        var floorname = "" + i;
        res_list[floorname] = [];
      }

      res_list["floors"] = floor_list;

      list.forEach(room => {
        res_list[room.floor].push(room._id);
      });

      res.status(200).send(res_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * GET /House/Rooms
 * Get all rooms from database and send as request.
 */
exports.list_all_rooms = function(req, res) {
  console.log("list_all_rooms");

  const options = {
    method: 'GET',
    uri: host+'/house/_all_docs',
  };

  request(options)
    .then(function (response) {
      var json_res = JSON.parse(response);
      var rooms = json_res['rows'];
      var rooms_list = [];
      rooms.forEach (room => {
        rooms_list.push(room['id']);
      });

      res.status(200).send({rooms: rooms_list});
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * GET /House/Rooms/{floor}
 * Get all rooms for a certain floor from database and send as request.
 */
exports.list_floor = function(req, res) {
  console.log(req.params)
  var floor = req.params['floor'];
  console.log(floor)
  const options = {
    method: 'POST',
    url: host + '/house/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        floor: { '$eq': floor }
      },
      fields: [ '_id', 'floor', 'name' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var floor_list = [];
      list.forEach(room => {
        floor_list.push({"id" : room['_id'], "name": room['name']})
      });
      console.log(floor_list)
      console.log(floor_list[0].id)

      res.status(200).send(floor_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });

  console.log("list_floor: " + floor);
};



/*
 * GET /House/Doors
 * Get all doors and their state from database and send as request.
 */
exports.list_all_doors = function(req, res) {
  console.log("list_all_doors");

  const options = {
    method: 'POST',
    url: host + '/doors/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$gt': '0' }
      },
      'fields': [ '_id', 'name', 'state' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var door_list = [];
      list.forEach(door => {
        door_list.push({"id" : door['_id'], "name": door['name'],
          'state': door['state']})
      });
      console.log(door_list)
      console.log(door_list[0].id)

      res.status(200).send(door_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * GET /House/Doors/{id}
 * Get state of door {id} and send as request.
 */
exports.show_door = function(req, res) {
  var door_id = req.params['id'];
  console.log("show_door: " + door_id);

  const options = {
    method: 'POST',
    url: host + '/doors/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': door_id }
      },
      'fields': [ '_id', 'name', 'state' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var door_res = {
        'id' : list[0]['_id'],
        'name': list[0]['name'],
        'state': list[0]['state']
      };
      console.log(door_res)

      res.status(200).send(door_res);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * POST /House/Doors/{id}
 * Change state of door {id} and send to openHAB.
 * Data: {state: "xxx"}
 * Allowed states: CLOSED, OPEN
 */
exports.update_door = function(req, res) {
  var door_id = req.params['id'];
  console.log("update_door: " + door_id + " " + req.body['state']);

  // Step 1: Get current rev from database
  const options = {
    method: 'POST',
    url: host + '/doors/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': door_id }
      },
      'fields': [ '_id', 'name', 'state', '_rev' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      console.log(list[0]['_id'])

      // Step 2: Update in database
      const options = {
        method: 'PUT',
        url: host + '/doors/' + list[0]['_id'],
        headers: {
         'Content-Type': 'application/json'
        },
        body: {
          "_rev": list[0]['_rev'],
          "name": list[0]['name'],
          "state": req.body['state']
        },
        json: true
      };

      request(options)
        .then(function (response) {
          console.log("Send to openHAB")
          console.log(response);

          // Step 3: Send to openHAB
          const options = {
            method: 'POST',
            url: 'http://192.168.188.26:8080/rest/items/' + response.id,
            headers: {
             'Content-Type': 'text/plain'
            },
            body: req.body['state']
          };

          request(options)
            .then(function (response) {
              console.log(response);
            })
        })
        res.status(200).send({})
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};



/*
 * GET /House/Heater
 * Get all heaters and their state from database and send as request.
 */
exports.list_all_heater = function(req, res) {
  console.log("list_all_heater");

  const options = {
    method: 'POST',
    url: host + '/heater/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$gt': '0' }
      },
      'fields': [ '_id', 'ist', 'soll', 'windows' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var heater_list = [];
      list.forEach(heater => {
        heater_list.push({"id" : heater['_id'], "ist" : heater['ist'],
          "soll" : heater['soll'], "windows": heater['windows']})
      });
      console.log(heater_list)
      console.log(heater_list[0].id)

      res.status(200).send(heater_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * GET /House/Heater/{room}
 * Get state of a certain room (Actual temperature, desired temperature,
 * window state)
 */
exports.show_heater = function(req, res) {
  var room = req.params['room'];
  console.log("show_heater: " + room);

  const options = {
    method: 'POST',
    url: host + '/heater/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': room }
      },
      'fields': [ '_id', 'ist', 'soll', 'windows' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var room_state = {
        "id" : list[0]._id,
        "ist": list[0].ist,
        "soll": list[0].soll,
        "windows": list[0].windows
      };
      console.log(room_state)

      res.status(200).send(room_state);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * POST /House/Heater/{room}
 * Change desired temperature of {room} and send to openHAB
 * Data: {temp: "xx.x"}
 * Allowed temperatures: Floating-Point numbers with one decimimal place
 */
exports.update_heater = function(req, res) {
  var room = req.params.room;
  console.log("update_heater: " + room + " " + req.body['temp']);

  // Step 1: Get current rev and data of room in database
  const options = {
    method: 'POST',
    url: host + '/heater/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': room }
      },
      'fields': [ '_id', '_rev', 'ist', 'soll', 'windows', 'name' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var res_data = response.docs[0];
      console.log(res_data);
      var rev = res_data._rev;
      var id = res_data._id;

      // Step 2: Update desired temperature in database
      const options = {
        method: 'PUT',
        url: host + '/heater/' + id,
        headers: {
         'Content-Type': 'application/json'
        },
        body: {
          "_rev" : rev,
          "ist" : res_data.ist,
          "windows" : res_data.windows,
          "soll" : req.body['temp'],
          "name" : res_data.name
        },
        json: true
      };

      request(options)
        .then(function (response) {
          // Step 3: Send new desired temperature to openHAB
          console.log("Send to openHAB")
          console.log(response);

          const options = {
            method: 'POST',
            url: 'http://192.168.188.26:8080/rest/items/' + res_data.name,
            headers: {
             'Content-Type': 'text/plain'
            },
            body: req.body['temp']
          };
          console.log(options);

          request(options)
            .then(function (response) {
              console.log(response);
            })
          res.status(200).send({});
        })
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};



/*
 * GET /House/Light
 * Get all lights and their states from database and send as request.
 */
exports.list_all_lights = function(req, res) {
  console.log("list_all_lights");

  const options = {
    method: 'POST',
    url: host + '/light/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$gt': "0" }
      },
      'fields': [ '_id', 'room', 'name', 'state', 'brightness', 'color' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var light_list = [];
      list.forEach (light => {
        light_list.push({
          "id": light._id,
          "room": light.room,
          "name": light.name,
          "state": light.state,
          "brightness": light.brightness,
          "color": light.color
        });
      });
      console.log(light_list)

      res.status(200).send(light_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * GET /House/Light/{room}
 * Get all lights and their states from {room} and send as request.
 */
exports.show_lights = function(req, res) {
  var room = req.params['room'];
  console.log("show_lights: " + room);

  const options = {
    method: 'POST',
    url: host + '/light/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        'room': { '$eq': room }
      },
      'fields': [ '_id', 'name', 'state', 'brightness', 'color' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var light_list = [];
      list.forEach (light => {
        light_list.push({
          "id": light._id,
          "name": light.name,
          "state": light.state,
          "brightness": light.brightness,
          "color": light.color
        });
      });
      //console.log(light_list)

      res.status(200).send(light_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * GET /House/Light/{id}
 * Get the state of the light {id and send as response.
 */
exports.show_one_light = function(req, res) {
  var light_id = req.params['id'];
  // console.log("show_light: " + light_id);

  const options = {
    method: 'POST',
    url: host + '/light/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': light_id }
      },
      'fields': [ '_id', 'name', 'state', 'brightness', 'color' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var light = {
        "id": list[0]._id,
        "name": list[0].name,
        "state": list[0].state,
        "brightness": list[0].brightness,
        "color": list[0].color
      };
      // console.log(light)

      res.status(200).send(light);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * POST /House/Light
 * Change state of one specific light and send to openHAB.
 * Data: {room: "xyz", name: "Light1", state: "ON/OFF"}
 */
exports.update_light = function(req, res) {
  console.log("update_light\n" + JSON.stringify(req.body));
  var light_name = req.body['name'];
  var room = req.body['room'];
  var new_state = req.body['state'];

  // Step 1: Get current rev of light from database
  const options = {
    method: 'POST',
    url: host + '/light/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': light_name }
      },
      'fields': [ '_id', '_rev', 'name', 'state', 'brightness', 'color' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var light_data = response.docs[0];
      console.log("Lights: ")
      console.log(light_data);

      // Step 2: Update state of light in database
      const options = {
        method: 'PUT',
        url: host + '/light/' + light_data._id,
        headers: {
         'Content-Type': 'application/json'
        },
        body: {
          "_rev": light_data._rev,
          "name": light_data.name,
          "brightness": light_data.brightness,
          "color": light_data.color,
          "state": new_state
        },
        json: true
      };

      console.log(options.body);

      request(options)
        .then(function (response2) {
          console.log(response2);
          // Step 3: Send new state to openHAB
          console.log("Send to openHAB")

          const options = {
            method: 'POST',
            url: 'http://192.168.188.26:8080/rest/items/' + light_data._id + "_Toggle",
            headers: {
             'Content-Type': 'text/plain'
            },
            body: req.body['state']
          };
          console.log(options);

          request(options)
            .then(function (response3) {
              console.log(response3);
            })
          res.status(200).send({});
        })
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * POST /House/Light/Color
 * Change color of a specific light and send to openHAB.
 * Data: {room: "xyz", name: "Light1", color: "xx, xx, xx"}
 */
exports.update_light_color = function(req, res) {
  console.log("update_light_color\n" + JSON.stringify(req.body));

  var light_name = req.body['name'];
  var room = req.body['room'];
  var new_color = req.body['color'];

  // Step 1: Get current rev of light from database
  const options = {
    method: 'POST',
    url: host + '/light/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': light_name }
      },
      'fields': [ '_id', '_rev', 'name', 'room', 'state', 'brightness', 'color' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var light_data = response.docs[0];
      console.log("Lights: ")
      console.log(light_data);

      // Step 2: Update state of light in database
      const options = {
        method: 'PUT',
        url: host + '/light/' + light_data._id,
        headers: {
         'Content-Type': 'application/json'
        },
        body: {
          "_rev": light_data._rev,
          "name": light_data.name,
          "brightness": light_data.brightness,
          "color": new_color,
          "state": light_data.state,
          "room": light_data.room
        },
        json: true
      };

      console.log(options.body);

      request(options)
        .then(function (response2) {
          console.log(response2);
          // Step 3: Send new state to openHAB
          console.log("Send to openHAB")

          const options = {
            method: 'POST',
            url: 'http://192.168.188.26:8080/rest/items/' + light_data._id + "_Color",
            headers: {
             'Content-Type': 'text/plain'
            },
            body: req.body['color']
          };
          console.log(options);

          request(options)
            .then(function (response3) {
              console.log(response3);
            })
          res.status(200).send({});
        })
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

/*
 * POST /House/Light/Bright
 * Change brightness of a specific light and send to openHAB.
 * Data: {room: "xyz", name: "Light1", brightness: "50"}
 */
exports.update_light_brightness = function(req, res) {
  console.log("update_light_brightness\n" + JSON.stringify(req.body));

  var light_name = req.body['name'];
  var room = req.body['room'];
  var new_bright = req.body['brightness'];

  // Step 1: Get current rev of light from database
  const options = {
    method: 'POST',
    url: host + '/light/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': light_name }
      },
      'fields': [ '_rev', '_id', 'room', 'name', 'state', 'brightness', 'color' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var light_data = response.docs[0];
      console.log("Lights: ")
      console.log(light_data);

      // Step 2: Update state of light in database
      const options = {
        method: 'PUT',
        url: host + '/light/' + light_name,
        headers: {
         'Content-Type': 'application/json'
        },
        body: {
          "_rev": light_data._rev,
          "name": light_data.name,
          "brightness": new_bright,
          "color": light_data.color,
          "state": light_data.state,
          "room": light_data.room
        },
        json: true
      };

      console.log(options.body);

      request(options)
        .then(function (response2) {
          console.log(response2);
          // Step 3: Send new state to openHAB
          console.log("Send to openHAB")

          const options = {
            method: 'POST',
            url: 'http://192.168.188.26:8080/rest/items/' + light_data._id + "_Dimmer",
            headers: {
             'Content-Type': 'text/plain'
            },
            body: req.body['brightness']
          };
          console.log(options);

          request(options)
            .then(function (response3) {
              console.log(response3);
            })
          res.status(200).send({});
        })
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};
