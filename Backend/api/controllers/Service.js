'use strict';

const request = require('request-promise');
// Host adress of the CouchDB instance
const host = "http://user:password@host:port";


/*
 * GET /Service
 * Get a list of all booked services.
 */
exports.get_booked_services = function(req, res) {
  console.log("get_booked_services");

  const options = {
    method: 'POST',
    url: host + '/service/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$gt': '0' }
      },
      'fields': [ '_id', 'type', 'date', 'time', 'dur', 'rep', 'comment' ]
    },
    json: true
  };

  request(options)
    .then(function (response) {
      var list = response['docs'];
      var service_list = [];
      list.forEach(service => {
        service_list.push({"id" : service['_id'], "type" : service['type'],
          "date": service['date'], "time": service['time'],
          "dur": service['dur'], "rep": service['rep'],
          "comment": service['comment']});
      });
      console.log(service_list)
      console.log(service_list[0].id)

      res.status(200).send(service_list);
    })
    .catch (function (err) {
      console.log(err);
      res.status(400).send(err);
    });
}

/*
 * POST /Service/new
 * Book a new service.
 * Data: {type: "String", date: "String", time: "String", dur: "String",
 *          rep: "String", comment: "String"}
 */
 exports.book_service = function(req, res) {
   console.log("book_service: " + req.body['type']);

   const options = {
     method: 'POST',
     url: host + '/service/',
     headers: {
      'Content-Type': 'application/json'
     },
     body: {
       "type": req.body['type'],
       "date": req.body['date'],
       "time": req.body['time'],
       "dur": req.body['dur'],
       "rep": req.body['rep'],
       "comment": req.body['comment']
     },
     json: true
   };

   request(options)
     .then(function (response) {
       if (response['ok']) {
         console.log("Added as booked service with id: " + response['id']);
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
  * POST /Service/edit
  * Edit a booked service.
  * Data: {id: "String", type: "String", date: "String", time: "String",
  *          dur: "String", rep: "String", comment: "String"}
  */
exports.edit_booked_service = function(req, res) {
  var service_id = req.body['id'];
  console.log("edit_booked_service: " + service_id);

  // Get current Rev first
  const options = {
    method: 'POST',
    url: host + '/service/_find',
    headers: {
     'Content-Type': 'application/json'
    },
    body: {
      selector: {
        '_id': { '$eq': service_id }
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
          url: host + '/service/',
          headers: {
           'Content-Type': 'application/json'
          },
          body: {
            "_id": service_id,
            "_rev": rev,
            "type": req.body['type'],
            "date": req.body['date'],
            "time": req.body['time'],
            "dur": req.body['dur'],
            "rep": req.body['rep'],
            "comment": req.body['comment']
          },
          json: true
        };

        request(options)
          .then(function (response) {
            if (response['ok']) {
              console.log("Edit booked service with id: " + response['id']);
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
 * GET /Service/cancel/{id}
 * Cancel the booked service {id}.
 */
 exports.cancel_booked_service = function(req, res) {
   var service_id = req.params['id'];
   console.log("cancel_booked_service: " + service_id);

   // Get current Rev first
   const options = {
     method: 'POST',
     url: host + '/service/_find',
     headers: {
      'Content-Type': 'application/json'
     },
     body: {
       selector: {
         '_id': { '$eq': service_id }
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
           url: host + '/service/' + service_id + '?rev=' + rev,
           headers: {
            'Content-Type': 'application/json'
           },
           json: true
         };

         request(options)
           .then(function (response) {
             if (response['ok']) {
               console.log("Canceled booked service with id: " + service_id);
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
  * GET /Service/{id}
  * Get information about the booked service {id}.
  */
  exports.get_booked_service = function(req, res) {
    var service_id = req.params['id'];
    console.log("get_booked_service: " + service_id);

    const options = {
      method: 'POST',
      url: host + '/service/_find',
      headers: {
       'Content-Type': 'application/json'
      },
      body: {
        selector: {
          '_id': { '$eq': service_id }
        },
        'fields': [ '_id', 'type', 'date', 'time', 'dur', 'rep', 'comment' ]
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
