var months = [
    "Jan","Feb","Mar",
    "Apr","May", "Jun",
    "Jul","Aug", "Sept",
    "Oct","Nov", "Dec"
  ]
  

var updateClock = function() {
    let middle = document.getElementById("middle");
    
    let date = new Date();

    middle.innerHTML = date.toLocaleDateString() + "\n" +date.toLocaleTimeString();
  }
  
  
  setInterval(updateClock, 1000);