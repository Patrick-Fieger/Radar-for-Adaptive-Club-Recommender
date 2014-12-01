// Speicher Values in Array bei click
'use strict';
var app = angular.module('radar', ['geolocation']);


// Angular Database Requests
// Holt die Clubs (samt Eigenschaften) aus einem json und speichert sie für angular lesbar 
app.controller('AppCtrl', function($scope, $http, geolocation) {
    
    /* Initiale clientInfos
     * FIXME: userId muss noch ermittelt & hinzugefügrt werden */ 
    var clientInfos = {
        "_userId": "",
        "position": [],
        "zoomLvl": 0
    }

    geolocation.getLocation().then(function(data){
      clientInfos.position = [data.coords.latitude, data.coords.longitude];
      $scope.getData(clientInfos); // erst sobald die position da ist, werden die Club-Circles erzeugt
    });

    // Erste initialisierung und funktion um sich die aktuellen Daten vom Server zu holen
    $scope.getData = function(clientInfos) {
        if(clientInfos != null)
            $http.post('./db/clubs.json', clientInfos).then(function(radarResponse) {
                console.log(JSON.stringify(clientInfos));
                $scope.result = radarResponse.data;
            });
    }

    /* Schränkt das Radar auf einen kleineren Bereich/weniger Clubs ein 
     * solange das Minimum (0) noch nicht erreicht ist
     * FIXME: Animation hinzufügen */
    $scope.zoomIn = function() {
        if(clientInfos.zoomLvl > 0)
        {
            clientInfos.zoomLvl--;
            $scope.getData(clientInfos);
        }
    }

    /* Erweitert das Radar um weitere Clubs 
     * solange das Maximum noch nicht erreicht ist
     * FIXME: Animation hinzufügen */
    $scope.zoomOut = function() {
        if(!$scope.result.isMax) 
        {
            clientInfos.zoomLvl++;
            $scope.getData(clientInfos);
        }
    }
});

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (e) {
        rotate(360 - e.alpha);
    }, false);
}

function rotate(deg){
	$('#radar_1').css('transform', 'rotate(' + deg + 'deg)');
}