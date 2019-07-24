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
  /* Hilfsfunktion um die Base-Adresse des Backends zu erhalten
   * Entsprechend der eigenen Adresse anpassen! */
  getBaseAdress: function() {
    return "http://host:port/";
  },
  /* Navigiere zu Dienstleistungen */
  goToDL: function() {
    window.location.href = "dienstleistung.html";
  },
  /* Navigiere zur Favoritenansicht */
  goToFavorites: function() {
    window.location.href = "index.html";
  },
  /* Navigiere zur Sicherheit Uebersicht */
  goToSicherheit: function() {
    window.location.href = "sicherheit.html";
  },
  /* Navigiere zur Haussteuerung */
  goToHaus: function() {
    window.location.href = "haus.html";
  },
  /* Navigiere einen Schritt zurueck. */
  goBack: function() {
    window.history.go(-1);
  },
  /* Navigiere zur Friseuruebersicht */
  goToFriseur: function() {
    window.location.href = "friseur.html";
  },
  /* Navigiere zur Zutrittssteuerung */
  goToZutritt: function() {
    window.location.href = "zutritt.html";
  },
  /* Navigiere zur Heizungssteuerung */
  goToHeizung: function() {
    window.location.href = "heizung.html";
  },
  /* Navigiere zur Zutrittssteuerung, zum Schritt "Benutzer neu anlegen" */
  goToZutrittNeu: function() {
    window.location.href = "zutritt_neu.html";
  },
  /* Navigiere zur Zutrittssteuerung, zum Schritt "Benutzer bearbeiten" */
  goToZutrittEdit: function() {
    window.location.href = "zutritt_edit.html";
  },
  /* Navigiere zur Zutrittssteuerung
   * zum Schritt "Neuen Benutzer bestaetigen" */
  goToZutrittConfirm: function() {
    // Hole die Daten aus dem Formular
    var data = {
      "name": document.getElementById("name").value,
      "zugang": document.getElementById("zugang").value,
      "code": document.getElementById("code").value,
      "ab": document.getElementById("ab").value,
      "bis": document.getElementById("bis").value
    };
    /* Bilde einen String aus den eingetragenen Daten, um sie zum
     * naechsten Schritt weiterzuleiten. */
    var querystr = "?name=" + data.name + "&zugang=" + data.zugang + "&code=" +
      data.code + "&ab=" + data.ab + "&bis=" + data.bis;
    window.location.href = "zutritt_confirm.html" + querystr;
  },
  /* Navigiere zur Zutrittssteuerung zum Schritt "Bestaetigung" und
   * trage die Daten in der Datenbank ein. */
  goToZutrittBenutzer: function() {
    // Hole die uebergebenen Daten
    var data = {
      "name": app.getParameterByName("name"),
      "zugang": app.getParameterByName("zugang"),
      "code": app.getParameterByName("code"),
      "ab": app.getParameterByName("ab"),
      "bis": app.getParameterByName("bis")
    };
    if (data.zugang == "PIN") {
      data.zugang = "PIN";
    } else if (data.zugang == "a") {
      data.zugang = "Armband";
    } else if (data.zugang == "c") {
      data.zugang = "Karte";
    } else if (data.zugang == "k") {
      data.zugang = "Anhänger";
    }
    // Formatiere die zwei Datumstrings richtig
    var ab = data.ab.split("-");
    data.ab = ab[2] + "." + ab[1] + "." + ab[0];
    var bis = data.bis.split("-");
    data.bis = bis[2] + "." + bis[1] + "." + bis[0];

    // Sende eine Anfrage an das Backend, um die Daten in die DB einzutragen
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        alert(res);
        /* Leite die Daten an die die naechste Seite weiter. */
        var querystr = document.getElementById("zutritt").innerHTML;
        window.location.href = "zutritt_benutzer.html?html=" + querystr;
      }
    });
    var url = app.getBaseAdress() + 'User/new';
    var params = "name=" + data.name + "&type=" + data.zugang + "&code="
      + data.code + "&from=" + data.ab + "&to=" + data.bis;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  },
  /* Navigiere zur Lichtsteuerung */
  goToLicht: function() {
    window.location.href = "licht.html";
  },
  /* Navigiere zum Menue */
  goToMenu: function() {
    window.location.href = "menu.html";
  },
  /* Navigiere zum Buchen eines Friseurs */
  goToFriseurNeu: function() {
    window.location.href = "friseur_neu.html";
  },
  /* Navigiere zur Bestaetigungsseite beim Buchen eines Friseurs */
  goToFriseurConfirm: function() {
    // Hole die Daten aus dem Formular
    var data = {
      "date": document.getElementById("date").value,
      "time": document.getElementById("time").value,
      "duration": document.getElementById("duration").value,
      "repetition": document.getElementById("repetition").value,
      "comment": document.getElementById("comment").value
    };
    /* Bilde einen String aus den eingetragenen Daten, um sie zum
     * naechsten Schritt weiterzuleiten. */
    var querystr = "?date=" + data.date + "&time=" + data.time + "&dur=" +
      data.duration + "&rep=" + data.repetition + "&comment=" + data.comment;
    window.location.href = "friseur_confirm.html" + querystr;
  },
  /* Hole die uebergebenen Userdaten und zeige sie an den richtigen
   * Stellen an */
  showZutrittUser: function () {
    // Hole die uebergebenen Daten
    var data = {
      "name": app.getParameterByName("name"),
      "zugang": app.getParameterByName("zugang"),
      "code": app.getParameterByName("code"),
      "ab": app.getParameterByName("ab"),
      "bis": app.getParameterByName("bis")
    };
    if (data.zugang == "PIN") {
      data.zugang = "PIN";
    } else if (data.zugang == "a") {
      data.zugang = "Armband";
    } else if (data.zugang == "c") {
      data.zugang = "Karte";
    } else if (data.zugang == "k") {
      data.zugang = "Anhänger";
    }
    // Formatiere die zwei Datumstrings richtig
    var ab = data.ab.split("-");
    data.ab = ab[2] + "." + ab[1] + "." + ab[0];
    var bis = data.bis.split("-");
    data.bis = bis[2] + "." + bis[1] + "." + bis[0];
    var htmlstring = data.name + "<br>" + data.zugang + " " + data.code +
      "<br>AB&ensp;" + data.ab + "<br>BIS " + data.bis;
    document.getElementById("zutritt").innerHTML = htmlstring;
  },
  /* Zeige den gebuchten Termin an */
  showFriseurAppt: function() {
    // Hole die uebergebenen Daten
    var data = {
      "date": app.getParameterByName("date"),
      "time": app.getParameterByName("time"),
      "duration": app.getParameterByName("dur"),
      "repetition": app.getParameterByName("rep"),
      "comment": app.getParameterByName("comment"),
    };
    if (data.repetition == "w") {
      data.repetition = "Wöchentlich";
    } else if (data.repetition == "2w") {
      data.repetition = "Zweiwöchentlich";
    } else if (data.repetition == "m") {
      data.repetition = "Monatlich";
    } else if (data.repetition == "t") {
      data.repetition = "Täglich";
    } else if (data.repetition == "2t") {
      data.repetition = "Alle 2 Tage";
    } else if (data.repetition == "vj") {
      data.repetition = "Vierteljährlich";
    } else if (data.repetition == "hj") {
      data.repetition = "Halbjährlich";
    } else if (data.repetition == "j") {
      data.repetition = "Jährlich";
    } else {
      data.repetition = "Siehe Kommentar";
    }
    // Formatieren den Datumsstring richtig
    var date = data.date.split("-");
    data.date = date[2] + "." + date[1] + "." + date[0];
    var htmlstring = data.date + "<br>" + data.time + " Uhr<br>" + data.duration +
      " h<br>" + data.repetition + "<br>" + data.comment;
    document.getElementById("friseur").innerHTML = htmlstring;
  },
  /* Zeige die Bestaetigung der Friseur-Buchung an */
  showFriseurApptFinal: function() {
    var htmlstring = app.getParameterByName('html');
    document.getElementById("friseur_conf").innerHTML = htmlstring;
  },
  /* Zeige die Bestaetigung des neuen Benutzers an */
  showZutrittUserFinal: function () {
    var htmlstring = app.getParameterByName('html');
    document.getElementById("zutritt_conf").innerHTML = htmlstring;
  },
  /* Hilfsfunktion, die Parameter aus der uebergebenen URL herausfiltert */
  getParameterByName: function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },
  /* Navigiere zur Anzeige des gebuchten Friseurtermins */
  goToFriseurTermin: function() {
    var querystr = document.getElementById("friseur").innerHTML;

    // Hole die uebergebenen Daten
    var data = {
      "type": "Friseur",
      "date": app.getParameterByName("date"),
      "time": app.getParameterByName("time"),
      "dur": app.getParameterByName("dur"),
      "rep": app.getParameterByName("rep"),
      "comment": app.getParameterByName("comment")
    };
    if (data.rep == "w") {
      data.rep = "Wöchentlich";
    } else if (data.rep == "2w") {
      data.rep = "Zweiwöchentlich";
    } else if (data.rep == "m") {
      data.rep = "Monatlich";
    } else if (data.rep == "t") {
      data.rep = "Täglich";
    } else if (data.rep == "2t") {
      data.rep = "Alle 2 Tage";
    } else if (data.rep == "vj") {
      data.rep = "Vierteljährlich";
    } else if (data.rep == "hj") {
      data.rep = "Halbjährlich";
    } else if (data.rep == "j") {
      data.rep = "Jährlich";
    } else {
      data.rep = "Siehe Kommentar";
    }
    // Formatieren den Datumsstring richtig
    var date = data.date.split("-");
    data.date = date[2] + "." + date[1] + "." + date[0];

    /* sende eine Anfrage an das Backend, den Friseurtermin zu buchen  */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        window.location.href = "friseur_termin.html?html=" + querystr;
      }
    });
    var url = app.getBaseAdress() + 'Service/new';
    var params = "type=" + data.type + "&date=" + data.date + "&time="
      + data.time + "&dur=" + data.dur + "&rep=" + data.rep + "&comment="
      + data.comment;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  },
  /* Navigiere zur Seite zum Bearbeiten von gebuchten Friseurterminen */
  goToFriseurEdit: function() {
    window.location.href = "friseur_edit.html";
  },
  /* Zeige alle gebuchten Friseurtermine auf einer Seite an, inklusive
   * einer Funktionalitaet zum Bearbeiten */
  friseurShowAll: function() {
    /* sende eine Anfrage an das Backend, um alle gebuchten
     * Termine anzuzeigen */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);

        var html = "<table class='appts_cell'><tr><th class='appts_cell'>" +
          "Aktion</th><th class='appts_cell'>Datum</th><th class='appts_cell'>" +
          "Uhrzeit</th><th class='appts_cell'>Dauer</th><th class='appts_cell'>" +
          "Wiederholung</th><th class='appts_cell'>Kommentar</th>";
        res.forEach(appt => {
          html += "<tr>";
          html += "<td class='appts_cell'><a onclick='app.editAppt(\"" +
            appt.id + "\")'>Ändern</a></td>";
          html += "<td class='appts_cell'>" + appt.date + "</td>";
          html += "<td class='appts_cell'>" + appt.time + " Uhr</td>";
          html += "<td class='appts_cell'>" + appt.dur + "h</td>";
          html += "<td class='appts_cell'>" + appt.rep + "</td>";
          html += "<td class='appts_cell'>" + appt.comment + "</td>";
          html += "</tr>";
        });
        html += "</table>";
        document.getElementById("appts").innerHTML = html;
      }
    });
    var url = app.getBaseAdress() + 'Service';
    xhr.open("GET", url);
    xhr.send();
  },
  /* Zeige alle gespeicherten Benutzer auf einer Seite an, inklusive
   * einer Funktionalitaet zum Bearbeiten */
  zutrittShowAll: function() {
    /* sende eine Anfrage an das Backend, um alle gespeicherten
     * Benutzer anzuzeigen */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);

        var html = "<table class='appts_cell'><tr><th class='appts_cell'>" +
          "Aktion</th><th class='appts_cell'>Name</th><th class='appts_cell'>" +
          "Zugang</th><th class='appts_cell'>Code</th><th class='appts_cell'>" +
          "Von</th><th class='appts_cell'>Bis</th>";
        res.forEach(user => {
          html += "<tr>";
          html += "<td class='appts_cell'><a onclick='app.editUser(\"" +
            user.id + "\")'>Ändern</a> - ";
          html += "<a onclick='app.deleteUser(\"" + user.id + "\", \"" +
            user.name + "\")'>Löschen</a></td>";
          html += "<td class='appts_cell'>" + user.name + "</td>";
          html += "<td class='appts_cell'>" + user.type + "</td>";
          html += "<td class='appts_cell'>" + user.code + "</td>";
          html += "<td class='appts_cell'>" + user.from + "</td>";
          html += "<td class='appts_cell'>" + user.to + "</td>";
          html += "</tr>";
        });
        html += "</table>";
        document.getElementById("users").innerHTML = html;
      }
    });
    var url = app.getBaseAdress() + 'User';
    xhr.open("GET", url);
    xhr.send();
  },
  /* Zeige ein Formular mit den gespeicherten Termindaten auf der Seite an,
   * damit diese geaendert werden koennen */
  editAppt: function(id) {
    /* sende eine Anfrage an das Backend, um den entsprechenden Termin
     * anzuzeigen */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        var html = "<form onsubmit='app.friseurEdit(); return false'><table>";

        // Das Datum muss von dd.mm.yyyy konvertiert werden zu yyyy-mm-dd
        var date = res.date.split(".");
        res.date = date[2] + "-" + date[1] + "-" + date[0];
        html += "<tr><td>Datum:</td><td><input type='date' name='date' id='date_f' class='edit_friseur' value='" + res.date + "'></td></tr>";
        html += "<tr><td>Uhrzeit:</td><td><input type='time' name='time' id='time_f' class='edit_friseur' value='" + res.time + "'></td></tr>";
        html += "<tr><td>Dauer:</td><td><input type='time' name='dur' id='dur' class='edit_friseur' value='" + res.dur + "'></td></tr>";
        html += "<tr><td>Wiederholung:</td><td><select name='rep' id='rep' class='edit_friseur'>";
        html += "<option selected value='" + res.rep + "'>" + res.rep + "</option>";
        html += "<option value='Wöchentlich'>Wöchentlich</option>";
        html += "<option value='Zwei-Wöchentlich'>Zwei-Wöchentlich</option>";
        html += "<option value='Monatlich'>Monatlich</option>";
        html += "<option value='Täglich'>Täglich</option>";
        html += "<option value='Alle 2 Tage'>Alle 2 Tage</option>";
        html += "<option value='Vierteljährlich'>Vierteljährlich</option>";
        html += "<option value='Halbjährlich'>Halbjährlich</option>";
        html += "<option value='Jährlich'>Jährlich</option>";
        html += "<option value='Sonstiges'>Sonstiges (als Kommentar eintragen)</option>";
        html += "</select></td></tr>";
        html += "<tr><td>Kommentar:</td><td><input type='text' name='comment' id='comment_f' class='edit_friseur' value='"
          + res.comment + "'></td></tr>";
        html += "<tr><td></td><td><a id='editAppt' onclick='app.friseurEdit(\"" + id + "\")'>Speichern</a></td></tr></table>";
        html += "</form>";
        document.getElementById("editAppt").innerHTML = html;
      }
    });
    var url = app.getBaseAdress() + 'Service/' + id;
    xhr.open("GET", url);
    xhr.send();
  },
  /* Zeige ein Formular mit den gespeicherten Benutzerdaten auf der Seite an,
   * damit diese geaendert werden koennen  */
  editUser: function(id) {
    /* sende eine Anfrage an das Backend, um den entsprechenden Benutzer
     * anzuzeigen */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        var html = "<form onsubmit='app.userEdit(\"" + id + "\"); return false'><table>";

        // Die Daten müssen von dd.mm.yyyy konvertiert werden zu yyyy-mm-dd
        var date = res.from.split(".");
        res.from = date[2] + "-" + date[1] + "-" + date[0];
        date = res.to.split(".");
        res.to = date[2] + "-" + date[1] + "-" + date[0];
        html += "<tr><td>Name:</td><td><input type='text' name='name' id='name_u' class='edit_friseur' value='" + res.name + "'></td></tr>";
        html += "<tr><td>Zugang:</td><td><select name='zugang' id='zugang_u' class='edit_friseur'>";
        html += "<option selected value='" + res.type + "'>" + res.type + "</option>";
        html += "<option value='PIN'>PIN</option>";
        html += "<option value='Armband'>Armband</option>";
        html += "<option value='Karte'>Karte</option>";
        html += "<option value='Anhänger'>Anhänger</option>";
        html += "<tr><td>Code:</td><td><input type='text' name='code' id='code_u' class='edit_friseur' value='" + res.code + "'></td></tr>";
        html += "<tr><td>Von:</td><td><input type='date' name='ab' id='ab_u' class='edit_friseur' value='" + res.from + "'></td></tr>";
        html += "<tr><td>Bis:</td><td><input type='date' name='bis' id='bis_u' class='edit_friseur' value='"
          + res.to + "'></td></tr>";
        html += "<tr><td></td><td><a id='editUser' onclick='app.userEdit(\"" + id + "\")'>Speichern</a></td></tr></table>";
        html += "</form>";
        document.getElementById("editAppt").innerHTML = html;
      }
    });
    var url = app.getBaseAdress() + 'User/' + id;
    xhr.open("GET", url);
    xhr.send();
  },
  /* Aendere den gespeicherten Friseurtermin */
  friseurEdit: function(id) {
    // Verarbeite die Daten aus dem Formular
    var data = {
      "id": id,
      "type": "Friseur",
      "date": document.getElementById("date_f").value,
      "time": document.getElementById("time_f").value,
      "dur": document.getElementById("dur").value,
      "rep": document.getElementById("rep").value,
      "comment": document.getElementById("comment_f").value,
    };

    // Das Datum muss von yyyy-mm-dd konvertiert werden zu dd.mm.yyyy
    var date = data.date.split("-");
    data.date = date[2] + "." + date[1] + "." + date[0];

    // Sende eine Nachricht an das Backend, um den Termin zu ändern
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        // Lade die Übersicht neu, um den aktualisierten Termin anzuzeigen
        location.reload();
      }
    });
    var url = app.getBaseAdress() + 'Service/edit';
    var params = "id=" + data.id + "&type=" + data.type + "&date=" + data.date
      + "&time=" + data.time + "&dur=" + data.dur + "&rep=" + data.rep
      + "&comment=" + data.comment;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  },
  /* Aendere die gespeicherten Benutzerdaten */
  userEdit: function(id) {
    // Verarbeite die Daten aus dem Formular
    var data = {
      "id": id,
      "name": document.getElementById("name_u").value,
      "type": document.getElementById("zugang_u").value,
      "code": document.getElementById("code_u").value,
      "from": document.getElementById("ab_u").value,
      "to": document.getElementById("bis_u").value,
    };

    // Die Daten müssen von yyyy-mm-dd konvertiert werden zu dd.mm.yyyy
    var date = data.from.split("-");
    data.from = date[2] + "." + date[1] + "." + date[0];
    var date = data.to.split("-");
    data.to = date[2] + "." + date[1] + "." + date[0];

    // Sende eine Nachricht an das Backend, um den Termin zu ändern
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        // Lade die Übersicht neu, um den aktualisierten Termin anzuzeigen
        location.reload();
      }
    });
    var url = app.getBaseAdress() + 'User/edit';
    var params = "id=" + data.id + "&name=" + data.name + "&type=" + data.type
      + "&code=" + data.code + "&from=" + data.from + "&to=" + data.to;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  },
  /* Navigiere zur Seite, auf der gespeicherte Friseurtermine storniert
   * werden koennen */
  goToFriseurCancel: function() {
    window.location.href = "friseur_cancel.html";
  },
  /* Zeige eine Liste aller Friseurtermine auf der Seite an, inklusive
   * einer Funktionalitaet um die Termine zu stornieren */
  friseurShowAllCancel: function() {
    /* sende eine Anfrage an das Backend, um alle gebuchten
     * Termine anzuzeigen */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);

        var html = "<table class='appts_cell'><tr><th class='appts_cell'>" +
          "Aktion</th><th class='appts_cell'>Datum</th><th class='appts_cell'>" +
          "Uhrzeit</th><th class='appts_cell'>Dauer</th><th class='appts_cell'>" +
          "Wiederholung</th><th class='appts_cell'>Kommentar</th>";
        res.forEach(appt => {
          html += "<tr>";
          html += "<td class='appts_cell'><a onclick='app.cancelAppt(\""
            + appt.id + "\", \"" + appt.date + "\", \"" + appt.time + "\")'>Stornieren</a></td>";
          html += "<td class='appts_cell'>" + appt.date + "</td>";
          html += "<td class='appts_cell'>" + appt.time + " Uhr</td>";
          html += "<td class='appts_cell'>" + appt.dur + "h</td>";
          html += "<td class='appts_cell'>" + appt.rep + "</td>";
          html += "<td class='appts_cell'>" + appt.comment + "</td>";
          html += "</tr>";
        });
        html += "</table>";
        document.getElementById("appts").innerHTML = html;
      }
    });
    var url = app.getBaseAdress() + 'Service';
    xhr.open("GET", url);
    xhr.send();
  },
  /* Loesche den ausgewaehlten Termin nach bestaetigter Nachfrage */
  cancelAppt: function(id, date, time) {
    if (confirm("Sind Sie sich sicher, dass Sie den Friseurtermin\nam " +
      date + " um " + time + " Uhr\nmit der ID " + id
      + "\nwirklich stornieren wollen?")) {
        // Termin wird geloescht
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            alert(res);
            location.reload();
          }
        });
        var url = app.getBaseAdress() + 'Service/cancel/' + id;
        xhr.open("GET", url);
        xhr.send();
      } else {
        // Nichts passiert..
      }

  },
  /* Loesche den ausgewaehlten Benutzer nach bestaetigter Nachfrage */
  deleteUser: function(id, name) {
    if (confirm("Sind Sie sich sicher, dass sie den Benutzer\n" +
      name + " mit der ID " + id + " wirklich löschen wollen?")) {
        // Termin wird geloescht
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            alert(res);
            location.reload();
          }
        });
        var url = app.getBaseAdress() + 'User/delete/' + id;
        xhr.open("GET", url);
        xhr.send();
    } else {
      // Nichts passiert..
    }
  },
  /* Gehe zur Lichtsteuerung des ausgewaehlten Raumes */
  goToLichtWozi: function() {
    window.location.href = "licht_wozi.html";
  },
  /* Gehe zur Heizungssteuerung des ausgewaehlten Raumes */
  goToHeizungWozi: function() {
    window.location.href = "heizung_wozi.html";
  },
  /* Hilfsfunktion, um HEX-Farbwerte in RGB-Farbwerte umzurechnen */
  hexToRgb: function(hex) {
      var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return rgb ? {
          r: parseInt(rgb[1], 16),
          g: parseInt(rgb[2], 16),
          b: parseInt(rgb[3], 16)
      } : null;
  },
  /* Hilfsfunktion, um RGB Farbwerte in HSV-Farbwerte umzurechnen */
  rgbToHsv: function(r, g, b) {
    var min, max, i, v, s, maxcolor, h, rgb = [];
    // Normalisiere die RGB-Werte auf eine Zahl zwischen 0 und 1
    rgb[0] = r / 255;
    rgb[1] = g / 255;
    rgb[2] = b / 255;
    min = rgb[0];
    max = rgb[0];
    maxcolor = 0;
    // Ermittle den kleinsten und groessten Farbwert
    for (i = 0; i < rgb.length - 1; i++) {
      if (rgb[i + 1] <= min) {min = rgb[i + 1];}
      if (rgb[i + 1] >= max) {max = rgb[i + 1]; maxcolor = i + 1;}
    }
    // Berechne den Farbwert
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
    // Berechne den Hellwert
    v = max*100;
    // Berechne die Farbsaettigung
    if (min == max) {
      s = 0;
    } else {
      s = (max - min)/max;
    }
    s = s*100;
    return {h : Math.round(h), s : Math.round(s), v : Math.round(v)};
  },
  /* Setze eine neue Solltemperatur fuer den aktuellen Raum */
  setSollTemp: function (temp) {
    // Hole die ID des aktuellen Raumes und die gewuenschte Temperatur
    var room_id = window.localStorage.getItem("currentRoomID");
    var temp = document.getElementById("tempRange").value;
    var data = "temp=" + temp

    /* sende eine Anfrage an das Backend, die Wunschtemperatur
     * des aktuellen Raumes zu aendern */
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
      }
    });
    var url = app.getBaseAdress() + 'House/Heater/' + room_id;
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
  },
  /* Veraendere die Wunschtemperatur um 0.5 Grad nach oben (+) oder unten (-) */
  changeTemp: function (dir) {
    // dir == -1 -> Temp verringern, dir == 1 -> Temp erhoehen
    var oldTemp = document.getElementById("tempRange").value;
    var newTemp = parseFloat(oldTemp) + (0.5 * dir);
    document.getElementById("tempRange").value = newTemp;
    app.setSollTemp(newTemp);
  },
  /* Oeffne/Schliesse die aktuell ausgewaehlte Tuer */
  toggleDoor: function (id, state) {
    var new_state = state;
    if (state == "OFF") {
      new_state = "ON";
    } else {
      new_state = "OFF";
    }
    var cmd = "state=" + new_state;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        /* Wird nicht extra gebraucht, da der Tuerstatus sowieso
         * periodisch geupdated wird */
        // app.loadDoors();
      }
    });

    xhr.open("POST", app.getBaseAdress() + 'House/Doors/' + id);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(cmd);
  },
  /* Hole den Zustand der Tueren periodisch alle 2 Sekunden vom Backend. */
  loadDoors: function() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        var html = document.getElementById("door_list").innerHTML;
        if (res.length == 0) {
          html = "Keine Türen im System hinterlegt."
        } else {
          html = "<table><tr><th colspan='2'><center>Schließsystem</center></th></tr>";
          door_list = [];
          res.forEach(door => {
            door_list.push(door.id);
            html = html + "<tr><td>" + door.name + "</td><td><img onclick=\"app.toggleDoor('" +
              door.id + "', '" + door.state + "')\" src='img/" + door.state + ".png'></td></tr>"
          });
          html = html + "</table>"
        }
        window.localStorage.setItem("doors", JSON.stringify(door_list));
        document.getElementById("door_list").innerHTML = html;
        setTimeout(app.loadDoors, 2000);
      }
    });
    var url = app.getBaseAdress() + 'House/Doors';
    xhr.open("GET", url);
    xhr.send();
  },
  /* Hole die Liste aller Raeume fuer die Heizungssteuerung. */
  loadHeaterRoomList: function () {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        var html = document.getElementById("floor_list").innerHTML;
        html = "";
        res["floors"].forEach (floor => {
          html = html + "<h3>" + floor + ". Etage</h3><br><div id='floor" + floor + "'></div>";
          document.getElementById("floor_list").innerHTML = html;

          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function () {
            if (this.readyState == 4) {
              var res = JSON.parse(this.responseText);
              var tmp = xhr.responseURL.split('/')
              var floor_i = tmp[tmp.length - 1]
              var floor_html = document.getElementById("floor" + floor_i).innerHTML;
              res.forEach(room => {
                // Baue eine Liste aller Raeume und Stockwerke
                floor_html = floor_html + "<a onclick='app.showHeater(\"" +
                  room.id + "\", \"" + room.name + "\")'>" + room.name + "</a><br>"
              });
              document.getElementById("floor" + floor_i).innerHTML = floor_html;
            }
          });
          var url = app.getBaseAdress() + 'House/Rooms/' + floor;
          xhr.open("GET", url);
          xhr.send();
        });
      }
    });
    var url = app.getBaseAdress() + 'House/Floors';
    xhr.open("GET", url);
    xhr.send();
  },
  /* Vorbereitung, um die Heizungssteuerung fuer den aktuellen
   * Raum anzuzeigen. */
  showHeater: function (room_id, room_name) {
    window.localStorage.setItem("currentRoomID", room_id);
    window.localStorage.setItem("currentRoomName", room_name);
    window.location.href = "heizung_wozi.html";
  },
  /* Zweiter Teil der Vorbereitung, um die Heizungssteuerung fuer
   * den aktuellen Raum anzuzeigen: Eintragen des Raumnamen und
   * Starten des periodischen Updatens des Heizungszustandes. */
  loadHeater: function() {
    var room_name = window.localStorage.getItem("currentRoomName");
    document.getElementById("room_name").innerHTML = room_name;
    app.pollHeater();
  },
  /* Periodisches Updaten des Heizungzustandes des aktuellen Raumes
   * alle zwei Sekunden. */
  pollHeater: function () {
    var room_id = window.localStorage.getItem("currentRoomID");

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 400) {
          alert("Keine Geräte für diesen Raum hinterlegt.");
          app.goBack();
        } else {
          var res = JSON.parse(this.responseText);
          document.getElementById("istTemp").innerHTML = res.ist + "&deg;C";
          document.getElementById("sollTemp").innerHTML = res.soll + "&deg;C";
          document.getElementById("tempRange").value = res.soll;

          var win_html = "";
          res['windows'].forEach(win => {
            win_html = win_html + "<img src='img/" + win.state + ".png'>&nbsp;";
          });
          document.getElementById("windows").innerHTML = win_html;

          setTimeout(app.pollHeater, 2000);
        }
      }
    });
    var url = app.getBaseAdress() + 'House/Heater/' + room_id;
    xhr.open("GET", url);
    xhr.send();
  },
  /* Hole die Liste aller Raeume fuer die Lichtsteuerung. */
  loadLightRoomList: function () {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        var html = document.getElementById("floor_list").innerHTML;
        html = "";
        res["floors"].forEach (floor => {
          html = html + "<h3>" + floor + ". Etage</h3><br><div id='floor" + floor + "'></div>";
          document.getElementById("floor_list").innerHTML = html;

          // Baue eine Liste aller Raeume und Stockwerke
          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function () {
            if (this.readyState == 4) {
              var res = JSON.parse(this.responseText);
              var tmp = xhr.responseURL.split('/')
              var floor_i = tmp[tmp.length - 1]
              var floor_html = document.getElementById("floor" + floor_i).innerHTML;
              res.forEach(room => {
                floor_html = floor_html + "<a onclick='app.showLight(\"" +
                  room.id + "\", \"" + room.name + "\")'>" + room.name + "</a><br>"
              });
              document.getElementById("floor" + floor_i).innerHTML = floor_html;
            }
          });
          var url = app.getBaseAdress() + 'House/Rooms/' + floor;
          xhr.open("GET", url);
          xhr.send();
        });
      }
    });
    var url = app.getBaseAdress() + 'House/Floors';
    xhr.open("GET", url);
    xhr.send();
  },
  /* Vorbereitung, um die Lichtsteuerung fuer den aktuellen Raum anzuzeigen. */
  showLight: function (room_id, room_name) {
    window.localStorage.setItem("currentRoomID", room_id);
    window.localStorage.setItem("currentRoomName", room_name);
    window.location.href = "licht_wozi.html";
  },
  /* Zeige die Lichter und ihre Steuerung fuer den ausgewaehlten Raum an und
   * starte das periodische Updaten des Lichtzustandes fuer jedes Licht. */
  loadLight: function() {
    var room_name = window.localStorage.getItem("currentRoomName");
    var room_id = window.localStorage.getItem("currentRoomID");
    document.getElementById("room_name").innerHTML = room_name;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 400) {
          alert("Keine Geräte für diesen Raum hinterlegt.");
          app.goBack();
        } else {
          var res = JSON.parse(this.responseText);
          var light_html = "";
          res.forEach(light => {
            light_html += "<div id='" + light.id + "'>" + light.name;
            light_html += "<img id='img_" + light.id + "' src='img/Light_" + light.state + ".png'>";
            light_html += "<img src='img/light_dim-.png'>";
            light_html += "<input type='range' min='1' max='100' class='range' id='" + light.id
              + "Range' oninput='app.setBrightness(\"" + room_id + "\", \"" + light.id + "\")'>";
            light_html += "<img src='img/light_dim+.png'>";
            light_html += "<input type='color' id='colorpicker_" + light.id + "' style='display:none' onchange='app.setColor(\"" + light.id + "\")'/>"
            light_html += "<img onclick='document.getElementById(\"colorpicker_" + light.id + "\").click()' src='img/light_color.png'>";
            light_html += "</div><br>";
            document.getElementById("light_list").innerHTML = light_html;

            app.pollLight(light.id);
          });
        }
      }
    });
    var url = app.getBaseAdress() + 'House/Light/' + room_id;
    xhr.open("GET", url);
    xhr.send();
  },
  /* Setze eine neue Farbe fuer die ausgewaehlte Lampe. */
  setColor: function (light_id) {
    var colorpicker = document.getElementById("colorpicker_" + light_id).value;
    alert("Farbe: " + colorpicker)

    /* Farbe vom Colorpicker ist in HEX und muss fuer openHAB in RGB
     * und dann in HSV umgerechnet werden */
    rgb = app.hexToRgb(event.target.value);
    hsv = app.rgbToHsv(rgb.r, rgb.g, rgb.b);

    var room_id = window.localStorage.getItem("currentRoomID");
    var data = "room=" + room_id + "&name=" + light_id + "&color=" + hsv.h + "," + hsv.s + "," + hsv.v;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        //alert("Changed!")
      }
    });
    var url = app.getBaseAdress() + 'House/Light/Color';
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
  },
  /* Periodisches Updaten des Lichtzustandes des aktuellen Lichts
   * alle zwei Sekunden. */
  pollLight: function (light_id) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        document.getElementById("img_" + light_id).src = "img/Light_" + res.state + ".png";
        document.getElementById(light_id + "Range").value = res.brightness;

        setTimeout(app.pollLight.bind(null, light_id), 2000);
      }
    });
    var url = app.getBaseAdress() + 'House/Light/Show/' + light_id;
    xhr.open("GET", url);
    xhr.send();
  },
  /* Setze eine neue Helligkeit und update den Wert in der Datenbank und
   * damit auch in openHAB. */
  setBrightness: function (room_id, light_id) {
    var brightness = document.getElementById(light_id + "Range").value;
    alert("Set brightness of light " + light_id + " in room " + room_id + " to " + brightness);

    var data = "room=" + room_id + "&name=" + light_id + "&brightness=" + brightness;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        var res = JSON.parse(this.responseText);
        //alert("Changed!")
      }
    });
    var url = app.getBaseAdress() + 'House/Light/Bright';
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
  }
};
