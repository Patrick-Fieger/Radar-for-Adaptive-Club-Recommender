// Speicher Values in Array bei click
'use strict';
var app = angular.module('radar', ['geolocation']);


// Angular Database Requests
// Holt die Clubs (samt Eigenschaften) aus einem json und speichert sie für angular lesbar 
app.controller('AppCtrl', function($scope, $http, geolocation) {
    $scope.values = {};
    
    geolocation.getLocation().then(function(data){
      $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
    });

    // Erste initialisierung und funktion um sich die aktuellen Daten vom Server zu holen
    $scope.getData = function() {
        $http.get('./db/clubs.json').then(function(clubsResponse) {
            $scope.result = clubsResponse.data;
        });
    }
    $scope.getData(true);
});

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (e) {
        rotate(360 - e.alpha);
    }, false);
}

function rotate(deg){
	$('#radar_1').css('transform', 'rotate(' + deg + 'deg)');
}