// Speicher Values in Array bei click
'use strict';
var app = angular.module('radar', []);


// Angular Database Requests
// Holt die Clubs (samt Eigenschaften) aus einem json und speichert sie für angular lesbar 
app.controller('AppCtrl', function($scope, $http) {
    $scope.values = {};

    // Erste initialisierung und funktion um sich die aktuellen Daten vom Server zu holen
    $scope.getData = function() {
        $http.get('./db/clubs.json').then(function(clubsResponse) {
            $scope.result = clubsResponse.data;
        });
    }
    $scope.getData(true);
});