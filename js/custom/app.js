// Speicher Values in Array bei click
'use strict';
var app = angular.module('radar', ['geolocation','ngAnimate']);
var isMobil = false;

// Angular Database Requests
// Holt die Clubs (samt Eigenschaften) aus einem json und speichert sie für angular lesbar 
app.controller('AppCtrl', function($scope, $http, geolocation) {
    
    /* Initiale clientInfos
     * FIXME: userId muss noch ermittelt & hinzugefügrt werden */ 
    $scope.clientInfos = {
        "userId": "",
        "position": [],
        "scale": 0
    }

    geolocation.getLocation().then(function(data){
      $scope.clientInfos.position = [data.coords.latitude, data.coords.longitude];
      $scope.getData($scope.clientInfos); // erst sobald die position da ist, werden die Club-Circles erzeugt
    });

    // Erste initialisierung und funktion um sich die aktuellen Daten vom Server zu holen
    $scope.getData = function(clientInfos) {
        if(clientInfos != null)
            //$http.post('./db/clubs.json', clientInfos).then(function(radarResponse) {
            $http.post('./db/clubs_'+$scope.clientInfos.scale+'.json', $scope.clientInfos).then(function(radarResponse) { // Behelfslösung bis der Server steht
                debug(JSON.stringify($scope.clientInfos));
                $scope.result = radarResponse.data;
            });
    }

    /* Schränkt das Radar auf einen kleineren Bereich/weniger Clubs ein 
     * solange das Minimum (0) noch nicht erreicht ist
     * FIXME: Animation hinzufügen */
    $scope.zoomIn = function() {
        if($scope.clientInfos.scale > 0)
        {
            $scope.clientInfos.scale--;
            $scope.getData($scope.clientInfos);
        }
    }

    /* Erweitert das Radar um weitere Clubs 
     * solange das Maximum noch nicht erreicht ist
     * FIXME: Animation hinzufügen */
    $scope.zoomOut = function() {
        if(!$scope.result.isMax) 
        {
            $scope.clientInfos.scale++;
            $scope.getData($scope.clientInfos);
        }
    }
});

function debug(content) {
    if(isMobil != null && isMobil == true)
        alert(content);
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