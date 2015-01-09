// Speicher Values in Array bei click
'use strict';
var app = angular.module('radar', ['geolocation']);
var isMobil = false;

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
      $scope.getData($scope.clientInfos); // erst sobald die position da ist, werden die Club-Circles erzeugt
    });

    // Erste initialisierung und funktion um sich die aktuellen Daten vom Server zu holen
    $scope.getData = function(clientInfos) {
        if(clientInfos != null)
            $http.get('./db/clubs_'+$scope.clientInfos.scale+'.json').then(function(radarResponse) { // Behelfslösung bis der Server steht
                updateView(radarResponse.data);
            });
    }

    $scope.rangeChange=function(){
        $scope.clientInfos.scale = $scope.range - 1;
        $scope.getData($scope.clientInfos);
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
    $(data.clubs).each(function(index, val) {
        var id = val._id;
        arrayID.push(id);
        if ($("#" + id).length == 0) {
            $('#radar_1').append('<div class="clubCircle" id="' + id + '">');
            setTimeout(function() {
                $("#" + id).addClass('_active');
            }, 100);
        }
        $("#" + id).css({
            top: val.position[0] * positionMultiplikator,
            left: val.position[1] * positionMultiplikator,
            width: val.size * groessenMultiplikator,
            height: val.size * groessenMultiplikator,
        });
    }).promise().done(function() {
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