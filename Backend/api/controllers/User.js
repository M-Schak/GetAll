'use strict';

const request = require('request-promise');
// Host adress of the CouchDB instance
const host = "http://user:password@host:port";

/*
 * GET /User
 * Get a list of all users.
 */
exports.get_all_users = function(req, res) {
  console.log("get_all_users");

  const options = {
    method: 'POST',
    url: host + '/user/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        _id: { '$gt': "0" }
      },
      fields: [ '_id', 'name', 'type', 'code', 'from', 'to' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];

      var user_list = [];
      list.forEach(user => {
        user_list.push({ "name": user.name, "id": user._id, "type": user.type,
          "code": user.code, "from": user.from, "to": user.to });
      });

      res.status(200).send(user_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
}

/*
 * POST /User/new
 * Add a new user.
 */
exports.add_user = function(req, res) {
  console.log("add_user");
  console.log("Data: " + JSON.stringify(req.body));

  const options = {
    method: 'POST',
    url: host + '/user/',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      "name": req.body['name'],
      "type": req.body['type'],
      "code": req.body['code'],
      "from": req.body['from'],
      "to": req.body['to']
    },
    json: true
  };

  request(options)
    .then(function (response) {
      if (response['ok']) {
        console.log("Added as new user with id: " + response['id']);
      } else {
        console.log("Something went wrong?")
      }
      res.status(200).send(response['ok']);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
}

/*
 * POST /User/edit
 * Edit the data from one user.
 */
exports.edit_user = function(req, res) {
  var user_id = req.body['id'];
  console.log("edit_user: " + user_id);

  // Get current Rev first
  const options = {
    method: 'POST',
    url: host + '/user/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': user_id }
      },
      'fields': [ '_id', '_rev' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      if (response['docs'].length > 0) {
        var rev = response['docs'][0]['_rev'];
        // Update data with rev and id

        const options = {
          method: 'POST',
          url: host + '/user/',
          headers: {
           'Content-Type': 'application/json'
          },
          body: {
            "_id": user_id,
            "_rev": rev,
            "name": req.body['name'],
            "type": req.body['type'],
            "code": req.body['code'],
            "from": req.body['from'],
            "to": req.body['to']
          },
          json: true
        };

        request(options)
          .then(function (response) {
            if (response['ok']) {
              console.log("Edit user with id: " + response['id']);
            } else {
              console.log("Something went wrong?")
            }
            res.status(200).send(response['ok']);
          })

      } else {
        res.status(404).send("ID not found");
      }
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });

}


/*
 * GET /User/delete/{id}
 * Delete the user with {id}.
 */
 exports.del_user = function(req, res) {
   var user_id = req.params['id'];
   console.log("del_user: " + user_id);

   // Get current Rev first
   const options = {
     method: 'POST',
     url: host + '/user/_find',
     headers: {
      'Content-Type': 'application/json'
     },
     body: {
       selector: {
         '_id': { '$eq': user_id }
       },
       'fields': [ '_id', '_rev' ]
     },
     json: true
   };

   request(options)
     .then(function (response) {
       if (response['docs'].length > 0) {
         var rev = response['docs'][0]['_rev'];
         // Delete data entry with rev and id

         const options = {
           method: 'DELETE',
           url: host + '/user/' + user_id + '?rev=' + rev,
           headers: {
            'Content-Type': 'application/json'
           },
           json: true
         };

         request(options)
           .then(function (response) {
             if (response['ok']) {
               console.log("Deleted user with id: " + user_id);
             } else {
               console.log("Something went wrong?")
             }
             res.status(200).send(response['ok']);
           })

       } else {
         res.status(404).send("ID not found");
       }
     })
     .catch (function (err) {
       console.log(err);
       res.status(400).send(err);
     });
 }


/*
 * GET /User/{id}
 * Get information about the user {id}.
 */
exports.get_user = function(req, res) {
  var user_id = req.params['id'];
  console.log("get_user with id " + user_id);

  const options = {
    method: 'POST',
    url: host + '/user/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': user_id }
      },
      'fields': [ '_id', 'name', 'type', 'code', 'from', 'to']
    },
    json: true
  };

  request(options)
    .then(function (response) {
      console.log(response['docs'][0]);

      res.status(200).send(response['docs'][0]);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
}
