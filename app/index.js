var months = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun",
  "Jul", "Aug", "Sept",
  "Oct", "Nov", "Dec"
]

var urlPredicate = "https://maps.googleapis.com/maps/api/directions/";

var updateClock = function () {
  let middle = document.getElementById("middle");

  let date = new Date();
  middle.innerHTML = date.toLocaleDateString() + "\n" + date.toLocaleTimeString();
}



function getDestination (dest){
  var directions;

  let request = new XMLHttpRequest();
  let pos = {
    lat: 36.9921614,
    lng: -122.0666995,
  }
  let userLocation = pos.lat + "," + pos.lng;

  let outputFormat = 'json?origin=' + userLocation +
                '&destination=' + dest + '&key=' + process.env.API_KEY;  


  let url = urlPredicate + outputFormat;
  
  console.log(url);

  let doneRequest = false

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
       doneRequest = true;
    }
  }
  request.open('GET',url, false);

  request.send(null);

    
  if (doneRequest){
    directions = request.response;
  }

  return JSON.parse(directions);

}

var updateDestinationTime = function(){
  let gilroy = getDestination(process.env.GILROY_HOME);
  let timeToGilroy = gilroy.routes["0"].legs["0"].duration.text;

  let liz = getDestination(process.env.LIZ_HOME);
  let timeToLiz = liz.routes["0"].legs["0"].duration.text;

  let lizHomeID = document.getElementById("lizHome");
  let glroyHomeID = document.getElementById("gilroyHome");

  glroyHomeID.innerHTML = "Gilroy: " + timeToGilroy;
  lizHomeID.innerHTML = "Liz: " + timeToLiz;
}

updateClock();
updateDestinationTime();

setInterval(updateClock, 1000);
setInterval(updateDestinationTime, 300000); //update every 5 mins