// Speicher Values in Array bei click
'use strict';
var app = angular.module('radar', ['geolocation']);
var isMobil = false;

app.filter('parseInt', function () {
  return function (item) {
    if(!isNaN(item)){
       return  parseInt(item)
    }
  };
});
// Angular Database Requests
// Holt die Clubs (samt Eigenschaften) aus einem json und speichert sie für angular lesbar 
app.controller('AppCtrl', function($scope, $http, geolocation) {
    $scope.range=1;
    /* Initiale clientInfos
     * FIXME: userId muss noch ermittelt & hinzugefügrt werden */ 
    $scope.clientInfos = {
        "userId": "",
        "position": [],
        "scale": 0
    }

    geolocation.getLocation().then(function(data){
      $scope.clientInfos.position = [data.coords.latitude, data.coords.longitude];
      $scope.nominatim($scope.clientInfos.position);
      $scope.getData($scope.clientInfos); // erst sobald die position da ist, werden die Club-Circles erzeugt
    });
    
    // API zur Umwandlung von Geodaten in Stadtnamen einbinden 
    $scope.nominatim = function(clientPosition) {
    	if(clientPosition != null) {    		
    		//Map Quest URL zum Anfragen der Daten (JSON-Format)
    		var mapquestUrl = 'http://open.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluu82961n9%2Crw%3Do5-9w1sgw&callback=renderGeodata';
    		mapquestUrl+='&json={';		
			mapquestUrl+='location:{latLng:{lat:'+ clientPosition[0] + ',lng:' + clientPosition[1] + '}}}';	//aktuellen Aufenthaltsort des User einfügen
			
			var mapquestScript = document.createElement('script');
    		mapquestScript.type = 'text/javascript';
    		mapquestScript.src = mapquestUrl;
    		document.body.appendChild(mapquestScript);    		
    	}
    }

    // Erste initialisierung und funktion um sich die aktuellen Daten vom Server zu holen
    $scope.getData = function(clientInfos) {
        if(clientInfos != null)
            $http.get('./db/clubs_'+$scope.clientInfos.scale+'.json').then(function(radarResponse) { // Behelfslösung bis der Server steht
                updateView(radarResponse.data);
                $scope.amountScaleSteps = radarResponse.data.amountScaleSteps;
                $scope.maxScaleValue = radarResponse.data.maxScaleValue;
            });
    }

    $scope.rangeChange=function(){
        $scope.clientInfos.scale = $scope.range - 1;
        $scope.getData($scope.clientInfos);
    }
});

	//aus den Geodaten der Position des Users Stadt ermitteln:
function renderGeodata (response) {
    	var userLocation = response.results[0].locations[0];
    		// adminArea5 = Stadt  
    	$('#search').attr("placeholder", userLocation.adminArea5);
    }

function debug(content) {
    if(isMobil != null && isMobil == true)
        console.log(content);
    else
        console.log(content);
}


if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (e) {
        rotate(e.alpha);
        if(e.alpha != 0) isMobil = true;
    }, false);
}

function rotate(deg){
	$('#radar_1').css('transform', 'rotate(' + deg + 'deg)');
}


var arrayID = [];
function updateView(data) {
    var positionMultiplikator = 250;
    var groessenMultiplikator = 30;
    arrayID = [];
    // Wir iterieren durch alle Clubs und speichern jeweils die ID in ein array
    $(data.clubs).each(function(index, val) {
        var id = val._id;
        arrayID.push(id);
        // Check ob element Existiert, falls nicht, wird dieses Objekt erzeugt
        if ($("#" + id).length == 0) {
            $('#radar_1').append('<div class="clubCircle" id="' + id + '">');
            setTimeout(function() {
                $("#" + id).addClass('_active');
            }, 100);
        }
        // Positionierung des Elements
        $("#" + id).css({
            top: val.position[0] * positionMultiplikator,
            left: val.position[1] * positionMultiplikator,
            width: val.size * groessenMultiplikator,
            height: val.size * groessenMultiplikator,
        });
    }).promise().done(function() {
        // Wir iterieren durch alle bisher erzeugten Elemente und checken ob diese mit dem zuvor
        // abgesicherten array übereinstimmen, falls nicht, wird dieses Element gelöscht
        $('.clubCircle').each(function(index, el) {
            if ($.inArray($(this).attr('id'), arrayID) == -1) {
                var that = $(this);
                that.removeClass('_active');
                setTimeout(function() {
                    that.remove();
                }, 350);
            }
        });
    });
}