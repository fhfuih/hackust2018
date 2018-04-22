  var datas = [];
  var parkingLots;
  var parkingLotsNum;
  var parkingLotsName;
  var parkingLotsLoc;
  var parkingLotsAddress;
  var parkingLotsVacancy;
  var ii;
  var infowindow;
  var my_map;
  var entryMarker;
  var exitMarker;


  // listerners
  function attachMyListener(markerr){
    markerr.addListener('center_changed', function() {
      window.setTimeout(function() {
        my_map.panTo(markerr.getPosition());
      }, 3000);
    });
    markerr.addListener('click', function() {
      my_map.setZoom(17);
      my_map.setCenter(markerr.getPosition());
    });
  }

  function attachParkingListener(index){
    parkingLots[index].addListener('center_changed', function() {
      window.setTimeout(function() {
        my_map.panTo(parkingLots[index].getPosition());
      }, 3000);
    });

    parkingLots[index].addListener('click', function() {
      function clickFunctionSetup(){
          my_map.setZoom(17);
          my_map.setCenter(parkingLots[index].getPosition());
          entryMarker.setPosition(parkingLotsLoc[index][1]);
          exitMarker.setPosition(parkingLotsLoc[index][2]);
         // entryMarker.setMap(map);
         // exitMarker.setMap(map);
      }
      window.setTimeout(clickFunctionSetup, 500);
    });
    
    parkingLots[index].addListener('mouseover', function(){
      nameString=parkingLotsName[index];
      addressString=parkingLotsAddress[index];
      vacancyString=parkingLotsVacancy[index];
      contentString  =
      "<div id='name'>"+
      nameString+
      "</div>"+
      "<div id='address'>"+
      addressString+
      "</div>"+
      "<div id='vacancy'>"+
      vacancyString+
      "</div>";
      infowindow.setContent(contentString);
      infowindow.open(my_map, parkingLots[index]);
    });
    
   parkingLots[index].addListener('rightclick', function(){
  // alert("hahahhaha");
    nameString=parkingLotsName[index];
    addressString=parkingLotsAddress[index];
    vacancyString=parkingLotsVacancy[index];
    contentString  =
    "<div id='graph' style='background-image:url(http://www.misucell.com/data/out/8/IMG_245734.png)'>"+
    "<b id='name' style='font-size:30px;color:#c1c0ce' >"+
   nameString+
    "</b>"+
    "<div id='address' style='font-size:20px;color:#c1c0ce'>"+
    addressString+
    "</div>"+
    "<div id='vacancy' style='font-size:20px;color:#2ced3e'>"+
    vacancyString+
    "</div>"+
    "</div>";
     infowindow.setContent(contentString);
     infowindow.open(my_map, parkingLots[index]);
        var width = 350;
        var height = 350;
        
        //ÔÚ body ÀïÌí¼ÓÒ»¸ö SVG »­²¼
        var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
        //»­²¼ÖÜ±ßµÄ¿Õ°×
        var padding = {left:15, right:15, top:10, bottom:10};
        var empty = parkingLotsVacancy[index];
        var occupied = 1000 - empty;
        var dataset = [ empty, occupied ]
        var pie = d3.layout.pie();
        var piedata = pie(dataset);
        var outerRadius = 90; //Íâ°ë¾¶
        var innerRadius = 60; //ÄÚ°ë¾¶£¬Îª0ÔòÖÐ¼äÃ»ÓÐ¿Õ°×
        //var colors = d3.scale.category20c();   //ÓÐÊ®ÖÖÑÕÉ«µÄÑÕÉ«±ÈÀý³ß
        var color = [d3.rgb("#DAF7A6"), d3.rgb("#FFA533")];
        var arc = d3.svg.arc()  //»¡Éú³ÉÆ÷
        .innerRadius(innerRadius)   //ÉèÖÃÄÚ°ë¾¶
        .outerRadius(outerRadius);  //ÉèÖÃÍâ°ë¾¶

        var arcs = svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform","translate("+ (width/2) +","+ (width/2) +")");
        arcs.append("path")
            .attr("fill",function(d,i){
              return color[i];
              })
              .attr("d",function(d){
                    return arc(d);   //µ÷ÓÃ»¡Éú³ÉÆ÷£¬µÃµ½Â·¾¶Öµ
                    }).attr("x",0)
                    .attr("y",0);
        
        svg.append("text")
        .attr("x", 200)
        .attr("y", 200)
        .style("text-anchor","middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "red")
        .text(dataset[0]+"\n"+"Remained");
        //var status = ["OccupiedRemained"]
        
        arcs.append("text")
        .attr("transform",function(d){
              return "translate(" + arc.centroid(d) + ")";
              })
              .attr("text-anchor","middle")
              .text(function(d,i){
                    return d.data;
                    });
                    
                    
        var rate = [Math.round(empty/(empty+occupied)*5)] ;
        var recoWord;
        var barColor;
        if(rate[0] == 1){
            barColor = "Red";
            recoWord = "Full";
        }
        else if(rate[0] == 2){
            barColor = "Orange";
            recoWord = "Busy";
        }
        else if(rate[0] == 3){
            barColor = "Yellow";
            recoWord = "Moderate";
        }
        else if(rate[0] == 4){
            barColor = "YellowGreen";
            recoWord = "vacant";
        }
        else{barColor = "LawnGreen";
            recoWord = "Empty";
        }
        var rectHeight = 50*rate;    //Ã¿¸ö¾ØÐÎËùÕ¼µÄÏñËØ¸ß¶È(°üÀ¨¿Õ°×)
                    
        rectang = svg.selectAll("rect")
            .data(rate)
            .enter();
        rectang.append("rect")
            .attr("x",100)
            .attr("y",function(d,i){
                    return 300;
                    })
            .attr("height",20)
            .attr("fill", barColor)
            .attr("width",0)
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("width",rectHeight)
            .attr("fill",barColor);
            
        rectang.append("text")
            .style("text-anchor","middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("fill", barColor)
            .text(recoWord)
            .attr("x",120)
            .attr("y", 320)
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("x",120+rectHeight)
            .attr("y",320);
    });
    parkingLots[index].addListener('mouseout', function(){
      //circle.setMap(null);
      //infowindow.close();
    });
}


// To set current position
function setPosition(position)
{
  var hkust = {lat: position.coords.latitude, lng: position.coords.longitude};
}

// Global variable
var hkust = {lat: 22.3364, lng: 114.2655};

  var nameString = "";
  var addressString = "";
  var vacancyString = "";
  
  var contentString  =
    "<div id='name'>"+
    nameString+
    "</div>"+
    "<div id='address'>"+
    addressString+
    "</div>"+
    "<div id='vacancy'>"+
    vacancyString+
    "</div>"+
    "<div id='graph' style='background-image:url(https://1vwqd637eh7q37n2sx1ijnqc-wpengine.netdna-ssl.com/wp-content/themes/so-creative/assets/img/brown-bg-img.png)'>"+
    "</div>";

function initMap(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  }
  $.ajaxSettings.async = false;
  $.getJSON("https://raw.githubusercontent.com/fhfuih/hackust2018/master/data.json",function(result){
    $.each(result, function(i, field){
      datas.push(field);
    });
  });
  $.ajaxSettings.async = true;
  parkingLots = [];
  parkingLotsNum = datas.length;
  parkingLotsName = [];
  parkingLotsLoc =[];
  parkingLotsAddress = [];
  parkingLotsVacancy = [];


  for(ii=0; ii < parkingLotsNum ; ii ++){
      parkingLotsLoc.push([
      {lat:parseFloat(datas[ii].lat), lng:parseFloat(datas[ii].lng)},
      {lat:parseFloat(datas[ii].lat+0.00082), lng:parseFloat(datas[ii].lng+0.00055)},
      {lat:parseFloat(datas[ii].lat + 0.000013), lng:parseFloat(datas[ii].lng+0.00124)}
      ]);
      parkingLotsName.push(datas[ii].name);
      parkingLotsAddress.push(datas[ii].address);
      parkingLotsVacancy.push(datas[ii].vacancy);
  }
  
  infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  setTimeout(defineMap, 3000);
}

function defineMap(){
  my_map = new google.maps.Map(document.getElementById("my_map"), {
  zoom: 14,
  center: hkust,
  mapTypeId: 'roadmap',
  styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]
});

  var me_marker = new google.maps.Marker({
    position: hkust,
    map: my_map
  });

  var entryIcon = {
    url: "https://openclipart.org/image/2400px/svg_to_png/13847/artmaster-login-mini-icon.png",
    scaledSize: new google.maps.Size(20, 20), 
  };

  var exitIcon = {
    url:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Logout.svg/2000px-Logout.svg.png', 
    scaledSize: new google.maps.Size(20, 20), 
  };

  var parkingLotIcon = {
  url:'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png', 
    scaledSize: new google.maps.Size(20, 20), 
  };

  entryMarker = new google.maps.Marker({
    position: hkust,
    map: null,
    title: "entry",
    icon: entryIcon
  });

  exitMarker = new google.maps.Marker({
    position: hkust,
    map: null,
    title: "exit",
    icon: exitIcon
  });

  // init parking poses
  var i;
  for(i = 0; i < parkingLotsNum;i++){
    var pos = parkingLotsLoc[i][0];
    var parkingLot = new google.maps.Marker({
      position: pos,
      map: my_map,
      icon: parkingLotIcon
    });
    parkingLots.push(parkingLot);
    attachParkingListener(i);
  }

    // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  my_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  my_map.addListener('bounds_changed', function() {
    searchBox.setBounds(my_map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });

    markers = [];
    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    my_map.fitBounds(bounds);
});
}
