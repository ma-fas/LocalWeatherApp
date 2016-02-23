$(document).ready(function(){
  var jqXHR,
      geoData,
      weatherData,
      tempC,
      tempF,
      imgBg,
      $location = $("#location"),
      $temp = $("#temperature"),
      $date = $("#date"),
      $weatherIcon = $("#weatherIcon"),
      $weatherStatus = $('#weatherStatus'),
      $windIcon = $('#windIcon'),
      $windStatus = $('#windStatus'),
      windChart = {
        N: 11.25,
        NNE: 33.75,
        NE: 56.25,
        ENE: 78.75,
        E: 101.25,
        ESE: 123.75,
        SE: 146.25,
        SSE: 168.75,
        S: 191.25,
        SSW: 213.75,
        SW: 236.25,
        WSW: 258.75,
        W: 281.25,
        WNW: 303.75,
        NW: 326.25,
        NNW: 348.75
      },
      deg = 22.5,
      windDirection,
      windIconDir,
      $switch = $('#switch');
      toggleTemp = false;
  
  function setTime(){
    setInterval(function(){
      var newDate = new Date();
      var currentDate = newDate.toLocaleString('en-GB');
      $date.text(currentDate);
    },1000); 
  }
  
  function calcTemp(temp){
    tempC = temp.toFixed(1);
    tempF = (32 + tempC * 1.8).toFixed(1);
    $temp.text(tempC + "°C");
  }

  function calcWindDeg(deg){
    var baseDeg = 0,
    key;
    for (key in windChart) {
      if (Math.abs(deg - windChart[key]) < Math.abs(deg - (baseDeg - deg))){
        windDirection = key;
      }
      windIconDir = windChart[key];
      $windIcon.css('transform', "rotate(" + windIconDir + 'deg)');
    }
  }
  
  function setIcon(iconData) {
    $weatherIcon.html('<img src="img/' + iconData + '.png" alt="Weather Icon">');
    imgBg = iconData.slice(0, -1);
    $('body').css("background-image", "url(img/" + imgBg + ".jpg)");
  }
  
  function locationReport(geoData){
    $location.text(geoData.city + ", " + geoData.country);
    setTime();
  }
  
  function weatherReport(weatherData) {
    setIcon(weatherData.weather[0].icon);
    calcTemp(weatherData.main.temp);
    $weatherStatus.text(weatherData.weather[0].description);
    calcWindDeg(weatherData.wind.deg);
    $windStatus.text(windDirection + ' ' + weatherData.wind.speed + "m/s ");
  }
  
  jqXHR = $.getJSON("http://ip-api.com/json/?fields=country,city,lat,lon", function(ipData) {
    geoData = ipData;
    // console.log(geoData); >> dev only
    locationReport(geoData);
  })
     
    .done(function(ipData){
      /* // dev only
      var info;
      for (info in ipData) {
       console.log("Request ok " + ipData[info]);
      }
      */  
       $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + geoData.lat + "&lon=" + geoData.lon + "&units=metric" + "&APPID=eb3e89c8bd05598a678535aa225a13bd", function(weatherData){
          // console.log(weatherData); >>dev only
        })

        .done(function(weatherData){
          // console.log("Weather request success"); >> dev only
          weatherReport(weatherData);
         })
        
        .fail(function(jqXHR, statusText, errorThrown){
            console.log('getJSON weather request failed' + statusText);
       });
    })
  
    .fail(function(jqXHR, statusText, errorThrown){
      console.log('getJSON IP request failed! ' + statusText);
        $('#adblockWarning').html("<strong>Failed to get location</strong><br/>Make sure you disable any AdBlock to use the weather app.");
    });
  
  $switch.click(function () {
    if (tempC !== undefined) {
      if (toggleTemp === false) {
        $switch.text("To Celcius");
        $temp.text(tempF + "°F");
        toggleTemp = true;
      } else {
        $temp.text(tempC + "°C");
        $switch.text("To Fahrenheit");
        toggleTemp = false;
      }
    }
  });
  
});