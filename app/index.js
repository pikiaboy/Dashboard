const { ipcRenderer } = require('electron');

//Map shown on col "right"
var map;
//Holds directions returned by google api
var directions = {};
//Current Postion of user
var userPos;

var directionsDisplay;
var directionsService;

var js_file = document.createElement('script');
js_file.type = 'text/javascript';
js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&key=' + process.env.API_KEY;


var urlPredicate = "https://maps.googleapis.com/maps/api/directions/";




//Used for Clock
var months = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun",
  "Jul", "Aug", "Sept",
  "Oct", "Nov", "Dec"
];



var updateClock = function () {
  let middle = document.getElementById("middle");

  let date = new Date();
  middle.innerHTML = date.toLocaleDateString() + "\n" + date.toLocaleTimeString();
}

function openSettings() {
  ipcRenderer.send('openSettings')
}

function getDestination(dest) {
  var directions;

  let request = new XMLHttpRequest();

  let userLocation = userPos.coords.latitude + "," + userPos.coords.longitude;

  let outputFormat = 'json?origin=' + userLocation +
    '&destination=' + dest + '&key=' + process.env.API_KEY;


  let url = urlPredicate + outputFormat;

  let doneRequest = false
  //waiting untill request is done
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      doneRequest = true;
    }
  }

  request.open('GET', url, false);

  request.send(null);

  //only set directions one requst has returned with data  
  if (doneRequest) {
    directions = request.response;
  }


  return JSON.parse(directions);

}

var updateDestinationTime = function () {
  var gilroyDirections = getDestination(process.env.GILROY_HOME);
  var lizDirections = getDestination(process.env.LIZ_HOME);


  if (!directions.hasOwnProperty("lizHome"))
    directions["lizHome"] = lizDirections;

  if (!directions.hasOwnProperty("gilroyHome"))
    directions["gilroyHome"] = gilroyDirections;

  let timeToGilroy = gilroyDirections.routes["0"].legs["0"].duration.text;

  let timeToLiz = lizDirections.routes["0"].legs["0"].duration.text;

  //instead of hardcoding Id, create an element and append it to html
  let lizHomeID = document.getElementById("lizHome");
  let glroyHomeID = document.getElementById("gilroyHome");

  glroyHomeID.innerHTML = "Gilroy: " + timeToGilroy;
  lizHomeID.innerHTML = "Liz: " + timeToLiz;
}

function showDirections(element) {
  //Possible way to let user choose mode
  let selectedMode = "DRIVING"

  let request = {
    origin: { lat: userPos.coords.latitude, lng: userPos.coords.longitude }, //user position
    destination: directions[element.id].routes["0"].legs["0"].end_address, //address stored in 
    travelMode: selectedMode,
    drivingOptions: {
      departureTime: new Date(Date.now()),
      trafficModel: 'bestguess'
    }
  }

  directionsService.route(request, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });


}


function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;

  map = new google.maps.Map(document.getElementById('right'), {
    center: { lat: userPos.coords.latitude, lng: userPos.coords.longitude },
    zoom: 14
  });

  directionsDisplay.setMap(map);

}

function init() {

  //When have current location, do functions with coords.
  var geoSuccess = function (position) {
    userPos = position;

    console.log(userPos.coords.latitude);
    console.log(userPos.coords.longitude);

    //Going Somewhere? tab
    updateDestinationTime();
    setInterval(updateDestinationTime, 300000); //update every 5 mins

    //Getting map renderer
    document.getElementsByTagName('head')[0].appendChild(js_file);

  };

  navigator.geolocation.getCurrentPosition(geoSuccess);


  updateClock();


  setInterval(updateClock, 1000);

}


init();

