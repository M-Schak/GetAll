# GetAll Backend und App
Hierbei handelt es sich um ein Projekt, das im Rahmen des [**Regionalen Innovationszentrums für Gesundheit und Lebensqualität Fulda**](http://hs-fulda.de/rigl-fulda) im Umsetzungsprojekt [*Gesundheitstechnik für die Alltagsbewältigung*](https://www.hs-fulda.de/forschen/wissens-und-technologietransfer/rigl-fulda/getall/) entstanden ist. 

Unser Ziel ist ein innovatives Baukastensystem, das sämtliche Assistenzsysteme und Smart Home-Produkte einer Wohnung integriert und mit (regionalen) haushaltsnahen Dienstleistungen verknüpft.

## Architektur
#### openHAB
Wir verwenden eine [openHAB](https://www.openhab.org/)-Instanz, mit Hilfe derer die Smart Home-Produkte und Assistenzsysteme verbunden werden. Aktuell für die Entwicklung ist openHAB über die integrierte REST-API erreichbar, diese soll in der Zukunft durch [MQTT](http://mqtt.org/) ersetzt werden. 

#### Datenbank
Eine [CouchDB-Datenbank](http://couchdb.apache.org/) speichert Informationen über die angelegten Räume und die vorhandenen Produkte inklusive ihrer Zustände. CouchDB wird über eine HTTP-Schnittstelle angesprochen. 

##### Datenbankmodell
```
/house
{
  "_id": "String",
  "floor": "Integer",
  "name": "String"
}

/doors
{
  "_id": "String",
  "name": "String", 
  "state": "ON/OFF" // ON = Closed, OFF = open
}

/heater
{
  "_id": "String",
  "ist": "Float", 
  "soll": "Float", 
  "name": "String",
  "windows" : [
    {
      "name": "String", 
      "state": "OPEN/CLOSED"
    }
  ]
}

/light
{
  "_id": "String",
  "name": "String", 
  "brightness": "Integer", 
  "color": "Integer, Integer, Integer",
  "state": "ON/OFF", 
  "room": "String"
}

```

#### Backend
Das Backend ist ein [Node.JS-Webserver](https://nodejs.org/en/), der als Verbindung zwischen der mobilen Anwendung, openHAB und der Datenbank dient. Es wird eine REST-API angeboten, über die mobile Anwendungen auf die bereitgestellten Daten zugreifen und diese manipulieren können. 

#### Mobile Anwendung
Eine [PhoneGap](https://phonegap.com/)-Anwendung bietet die Möglichkeit für Benutzer, auf all ihre Geräte zuzugreifen. Diese Anwendung ist aktuell als erster Entwurf in Form eines Prototypen umgesetzt. Viele Seiten sind Zeichnungen mit Verlinkungen und nur teilweise dynamischen Inhalten. 

## Anleitung
Der Node.JS-Webserver kann nach der Installation von Node.JS und npm mit folgendem Befehl gestartet werden: 

```
cd Backend
npm install
node server.js
```

In der Datei `Backend/api/controllers/House.js` muss dafür die Konstante `host` durch die eigene Adresse zur CouchDB-Instanz ersetzt werden. 

Die Mobile Anwendung kann entweder im Browser betrachtet/verwendet werden (hierzu die Datei `MobileApp/www/index.html` im Browser aufrufen) oder mit Hilfe von PhoneGap bzw. [PhoneGap Build](https://build.phonegap.com/) in mobile Apps für iOs, Android und Windows Phone überführt werden. In der Datei `MobileApp/www/js/index.js` muss dafür in der Funktion `getBaseAdress()` die Adresse des Webservers eingetragen werden. 


## ToDo
* MQTT für die Kommunikation zwischen openHAB und dem Backend
* Benutzer für die Zutrittssteuerung tatsächlich in die Datenbank eintragen (und mit openHAB koppeln)
* Buchung der Beispiel-Dienstleistung (Friseur) tatsächlich in die Datenbank eintragen
