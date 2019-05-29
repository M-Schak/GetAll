/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    showAllAppointments: function() {
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var options = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit',  minute: '2-digit'};
          var res = JSON.parse(xhttp.responseText);
          var data = "<table><tr style='border: 1px solid black'><td><b>Name</b></td><td><b>Termin</b></td><td><b>Kommentar</b></td><td><b>Absagen</b></td></tr>";
          for (i = 0; i < res.length; i++) {
            data += "<tr style='border: 1px solid black'>";
            data += "<td>" + res[i].name + "</td>";
            data += "<td>" + new Date(res[i].appointment).toLocaleDateString('de-DE', options) + "</td>";
            data += "<td>" + res[i].comment + "</td>";
            data += "<td><button onClick=\"app.removeAppt('" + res[i]._id + "');\">Termin absagen</button></td>";
            data += "</tr>";
          }
          data += "</table>";
          document.getElementById('appts').innerHTML = data;
        }
      }

      xhttp.open("GET", "http://10.42.0.1:8080/barber");
      xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhttp.send();
    },
    removeAppt: function(id) {
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          alert("Termin erfolgreich abgesagt!");
          app.showAllAppointments();
        }
      }

      var url = "http://10.42.0.1:8080/barber/" + id;
      xhttp.open("POST", url);
      xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhttp.send();
    },
    friseurBuchen: function() {
      var appointment = new Date(document.getElementById('datetime').value);
      var kommentar = document.getElementById('kommentar').value;
      var res = "";

      var data = {
        "name" : "Testapp User",
        "appointment" : appointment
      };

      if (kommentar.length > 0) {
        data["comment"] = kommentar;
      }

      var url_data = '';

      for (var key in data) {
        url_data += encodeURIComponent(key) + '='
          + encodeURIComponent(data[key]) + '&';
      }
      url_data = url_data.substring(0, url_data.length - 1);

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4 && this.status == 200) {
          app.showAllAppointments();
        }
      });

      xhr.open("POST", "http://10.42.0.1:8080/barber");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(url_data);
    }
};
