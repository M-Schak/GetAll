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
    goToDL: function() {
      window.location.href = "dienstleistung.html";
    },
    goToFavorites : function() {
      window.location.href = "index.html";
    },
    goToSicherheit: function() {
      window.location.href = "sicherheit.html";
    },
    goToHaus: function() {
      window.location.href = "haus.html";
    },
    goBack: function() {
      window.history.go(-1);
    },
    goToFriseur: function() {
      window.location.href = "friseur.html";
    },
    goToZutritt: function() {
      window.location.href = "zutritt.html";
    },
    goToHeizung: function() {
      window.location.href = "heizung.html";
    },
    goToZutrittNeu: function() {
      window.location.href = "zutritt_neu.html";
    },
    goToZutrittConfirm: function() {
      window.location.href = "zutritt_confirm.html";
    },
    goToZutrittBenutzer: function() {
      window.location.href = "zutritt_benutzer.html";
    },
    goToLicht: function() {
      window.location.href = "licht.html";
    },
    goToMenu: function() {
      window.location.href = "menu.html";
    },
    goToFriseurNeu: function() {
      window.location.href = "friseur_neu.html";
    },
    goToFriseurConfirm: function() {
      window.location.href = "friseur_confirm.html";
    },
    goToFriseurTermin: function() {
      window.location.href = "friseur_termin.html";
    },
    goToLichtWozi: function() {
      window.location.href = "licht_wozi.html";
    },
    goToHeizungWozi: function() {
      window.location.href = "heizung_wozi.html";
    },
    togglePrototype: function(type) {
      if (type == 0) { // Bleistift -> Digital
        window.location.href = "dienstleistung2.html";
      } else if (type == 1) { // Digital -> Bleistift
        window.location.href = "dienstleistung.html";
      }
    },
    toggle_tischlampe: function() {
      if (document.getElementById("licht_wozi").alt == "00") {
        app.setLightStatus (1, 1);
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_2.jpeg";
        document.getElementById("licht_wozi").alt = "01";
      } else if (document.getElementById("licht_wozi").alt == "10") {
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_1.jpeg";
        document.getElementById("licht_wozi").alt = "11";
        app.setLightStatus (1, 1);
      } else if (document.getElementById("licht_wozi").alt == "01") {
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_4.jpeg";
        document.getElementById("licht_wozi").alt = "00";
        app.setLightStatus (1, 0);
      } else if (document.getElementById("licht_wozi").alt == "11") {
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_3.jpeg";
        document.getElementById("licht_wozi").alt = "10";
        app.setLightStatus (1, 0);
      }
    },
    toggle_leselampe: function() {
      if (document.getElementById("licht_wozi").alt == "00") {
        app.setLightStatus (0, 1);
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_3.jpeg";
        document.getElementById("licht_wozi").alt = "10";
      } else if (document.getElementById("licht_wozi").alt == "10") {
        app.setLightStatus (0, 0);
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_4.jpeg";
        document.getElementById("licht_wozi").alt = "00";
      } else if (document.getElementById("licht_wozi").alt == "01") {
        app.setLightStatus (0, 1);
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_1.jpeg";
        document.getElementById("licht_wozi").alt = "11";
      } else if (document.getElementById("licht_wozi").alt == "11") {
        app.setLightStatus (0, 0);
        document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_2.jpeg";
        document.getElementById("licht_wozi").alt = "01";
      }
    },
    pickColor: function(lampe) {
      if (lampe == 0) { // Leselampe
        var elem1 = document.getElementById('colorpicker');
        if (elem1) {
          elem1.click();
          elem1.addEventListener("change", app.setLeseColor, true);
        }
      } else if (lampe == 1) { // Tischlampe
        var elem2 = document.getElementById('colorpicker2');
        if (elem2) {
          elem2.click();
          elem2.addEventListener("change", app.setTischColor, true);
        }
      }
    },
    setTischColor: function (event) {
      rgb = app.hexToRgb(event.target.value);
      hsv = app.rgbToHsv(rgb.r, rgb.g, rgb.b);

      var itemname = "Light1_Color";
      var cmd = hsv.h + "," + hsv.s + "," + hsv.v;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4) {
          //alert("Yay!");
        }
      });

      xhr.open("POST", "http://192.168.188.26:8080/rest/items/" + itemname);
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.send(cmd);
    },
    setLeseColor: function (event) {
      rgb = app.hexToRgb(event.target.value);
      hsv = app.rgbToHsv(rgb.r, rgb.g, rgb.b);

      var itemname = "Light2_Color";
      var cmd = hsv.h + "," + hsv.s + "," + hsv.v;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4) {
          //alert("Yay!");
        }
      });

      xhr.open("POST", "http://192.168.188.26:8080/rest/items/" + itemname);
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.send(cmd);
    },
    hexToRgb: function(hex) {
        var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return rgb ? {
            r: parseInt(rgb[1], 16),
            g: parseInt(rgb[2], 16),
            b: parseInt(rgb[3], 16)
        } : null;
    },
    rgbToHsv: function(r, g, b) {
      var min, max, i, v, s, maxcolor, h, rgb = [];
      rgb[0] = r / 255;
      rgb[1] = g / 255;
      rgb[2] = b / 255;
      min = rgb[0];
      max = rgb[0];
      maxcolor = 0;
      for (i = 0; i < rgb.length - 1; i++) {
        if (rgb[i + 1] <= min) {min = rgb[i + 1];}
        if (rgb[i + 1] >= max) {max = rgb[i + 1]; maxcolor = i + 1;}
      }
      if (min == max) {
        h = 0;
      }
      else if (maxcolor == 0) {
        h = ((rgb[1] - rgb[2]) / (max - min) % 6);
      }
      else if (maxcolor == 1) {
        h = (2 + (rgb[2] - rgb[0]) / (max - min));
      }
      else if (maxcolor == 2) {
        h = (4 + (rgb[0] - rgb[1]) / (max - min));
      }
      if (isNaN(h)) {h = 0;}
      h = h * 60;
      if (h < 0) {
        h = h + 360;
      }
      v = max*100;
      if (min == max) {
        s = 0;
      } else {
        s = (max - min)/max;
      }
      s = s*100;
      return {h : Math.round(h), s : Math.round(s), v : Math.round(v)};
    },
    pollLight1Status: function () {
      var itemname = "Light1_Toggle";
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var res = xhttp.responseText;
          if (res == "ON" && document.getElementById("licht_wozi").alt == "00") {
            // Tischlampe (gross) an, aber im Interface noch aus
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_2.jpeg";
            document.getElementById("licht_wozi").alt = "01";
          } else if (res == "ON" && document.getElementById("licht_wozi").alt == "10") {
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_1.jpeg";
            document.getElementById("licht_wozi").alt = "11";
          } else if (res == "OFF" && document.getElementById("licht_wozi").alt == "01") {
            // Tischlampe gross aus, aber im Interface noch an
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_4.jpeg";
            document.getElementById("licht_wozi").alt = "00";
          } else if (res == "OFF" && document.getElementById("licht_wozi").alt == "11") {
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_3.jpeg";
            document.getElementById("licht_wozi").alt = "10";
          }

          setTimeout(app.pollLight1Status, 2000);
        }
      }

      xhttp.open("GET", "http://192.168.188.26:8080/rest/items/" + itemname + "/state");
      xhttp.setRequestHeader("Content-Type", "text/plain");
      xhttp.send();
    },
    pollLight2Status: function () {
      var itemname = "Light2_Toggle";
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var res = xhttp.responseText;
          if (res == "ON" && document.getElementById("licht_wozi").alt == "00") {
            // Leselampe (klein) an, aber im Interface noch aus 0x -> 1x
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_3.jpeg";
            document.getElementById("licht_wozi").alt = "10";
          } else if (res == "ON" && document.getElementById("licht_wozi").alt == "01") {
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_1.jpeg";
            document.getElementById("licht_wozi").alt = "11";
          } else if (res == "OFF" && document.getElementById("licht_wozi").alt == "10") {
            // Leselampe klein aus, aber im Interface noch an 1x -> 0x
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_4.jpeg";
            document.getElementById("licht_wozi").alt = "00";
          } else if (res == "OFF" && document.getElementById("licht_wozi").alt == "11") {
            document.getElementById("licht_wozi").src = "img/Interface_Prototyp_9_2.jpeg";
            document.getElementById("licht_wozi").alt = "01";
          }

          setTimeout(app.pollLight2Status, 2000);
        }
      }

      xhttp.open("GET", "http://192.168.188.26:8080/rest/items/" + itemname + "/state");
      xhttp.setRequestHeader("Content-Type", "text/plain");
      xhttp.send();
    },
    pollLight1Brightness: function () {
      var itemname = "Light2_Dimmer";
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var res = xhttp.responseText;
          alert(res + " " + parseInt(res))
          if (document.getElementById("leseRange").value != parseInt(res)) {
            document.getElementById("leseRange").value = parseInt(res);
          }

          setTimeout(app.pollLight1Brightness, 2000);
        }
      }

      xhttp.open("GET", "http://192.168.188.26:8080/rest/items/" + itemname + "/state");
      xhttp.setRequestHeader("Content-Type", "text/plain");
      xhttp.send();
    },
    pollLight2Brightness: function () {
      var itemname = "Light1_Dimmer";
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var res = xhttp.responseText;
          alert(res + " " + parseInt(res))
          if (document.getElementById("tischRange").value != parseInt(res)) {
            document.getElementById("tischRange").value = parseInt(res);
          }

          setTimeout(app.pollLight1Brightness, 2000);
        }
      }

      xhttp.open("GET", "http://192.168.188.26:8080/rest/items/" + itemname + "/state");
      xhttp.setRequestHeader("Content-Type", "text/plain");
      xhttp.send();
    },
    setLightStatus: function (lampe, status) {
      // lampe 0 == Leselampe klein, Lampe 1 = Tischlampe gross
      // Status 0 == turn OFF, Status 1 == turn ON
      var itemname = "Light1_Toggle";
      if (lampe == 0) {
        itemname = "Light2_Toggle";
      }
      var cmd = "OFF"
      if (status == 1) {
        cmd = "ON"
      }
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4) {
          //alert("Yay!");
        }
      });

      xhr.open("POST", "http://192.168.188.26:8080/rest/items/" + itemname);
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.send(cmd);
    },
    setLightDimmer: function (lampe, percent) {
      // lampe 1 == Tischlampe, lampe 0 == Leselampe
      var itemname = "Light1_Dimmer";
      if (lampe == 0) {
        itemname = "Light2_Dimmer";
      }
      var cmd = "" + percent;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4) {
          //alert("Yay!");
        }
      });

      xhr.open("POST", "http://192.168.188.26:8080/rest/items/" + itemname);
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.send(cmd);
    }
};
