// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        ngFB.init({
            appId: '1032568913478697'
        });
    });
})



.controller('MapController', function($scope, $ionicLoading, $interval, $ionicModal, $timeout, ngFB, $http) {


    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 20,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);




        $scope.fbLogin = function() {

            var userdata = {};
            var alllocations = {};

            ngFB.login({
                scope: 'email, public_profile, publish_actions'
            }).then(
                function(response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');




                        ngFB.api({
                            path: '/me',
                            params: {
                                fields: 'id,name'
                            }
                        }).then(
                            function(user) {
                                console.log(user);
                                userdata = user;
                                navigator.geolocation.getCurrentPosition(function(pos) {

                                    var time = new Date;
                                    console.log(time.toLocaleString());

                                    var userlocation = {
                                        'name': userdata.name,
                                        'id': userdata.id,
                                        'latitude': pos.coords.latitude,
                                        'longitude': pos.coords.longitude,
                                        'time': time.toLocaleString()
                                    }

                                    var link = "http://whereareyou.16mb.com/getallusers.php";
                                    $http.post(link, userlocation).then(function(res) {
                                        // var tempalllocations=res.data.data;
                                        // alllocations=JSON.stringify(tempalllocations);
                                        // alllocations=tempalllocations.replace(/['"]+/g, '');
                                        // console.log(alllocations);
                                        alllocations = res.data.data;




                                        function addinfowindow(marker, message) {
                                            var infoWindow = new google.maps.InfoWindow({
                                                content: message
                                            })

                                            google.maps.event.addListener(marker, 'click', function() {
                                                infoWindow.open(map, marker);
                                            })
                                        }


                                        for (var i = 0; i < alllocations.length; i++) {

                                            var contentString = '<center><img src=https://graph.facebook.com/' + alllocations[i].id + '/picture?type=large style="width:100px; height: 100px; border-radius:50%"><br>' + alllocations[i].name + '<br>Last Seen at <code>' + alllocations[i].time;
                                            var mycoordinates = new google.maps.LatLng(alllocations[i].latitude, alllocations[i].longitude);
                                            // alert(mycoordinates);

                                            var link = "http://whereareyou.16mb.com/markerpic.php";
                                            var whosepic={"id":alllocations[i].id}
                                            $http.post(link, whosepic).then(function(res) {
                                                console.log(res);
                                    });

                                            var myLocation = new google.maps.Marker({
                                                position: mycoordinates,
                                                map: map,
                                                clickable: true,
                                                title: alllocations[i].name,
                                                icon: {url:'https://graph.facebook.com/' + alllocations[i].id + '/picture?type=large', scaledSize: new google.maps.Size(50, 50)}
                                            });

                                            addinfowindow(myLocation, contentString);
                                        }




                                        console.log(alllocations);
                                    })


                                    // alllocations=[{"id":"908316652629965","name":"Anup Kumar Panwar","latitude":"30.7486833","longitude":"76.7577116","time":"7/22/2016, 3:27:08 PM"}];




                                    console.log("reached here");

                                    //     $interval(function(){
                                    //     var link="http://whereareyou.16mb.com/getallusers.php";
                                    //     $http.post(link, userlocation).then(function (res){
                                    //         alllocations=res.data;
                                    //     })

                                    // },10000)


                                });

                                $scope.user = user;
                            },

                            function(error) {
                                alert('Facebook error: ' + error.error_description);
                            });

                    } else {
                        alert('Facebook login failed');
                    }
                });
        }




        // ______________________________________________________________________________________________________________________________

        // var userdata = {}
        // var alllocations={}

        // ngFB.login({
        //     scope: 'email, public_profile, publish_actions'
        // }).then(
        //     function(response) {
        //         if (response.status === 'connected') {
        //             console.log('Facebook login succeeded');




        //             ngFB.api({
        //                 path: '/me',
        //                 params: {
        //                     fields: 'id,name'
        //                 }
        //             }).then(
        //                 function(user) {
        //                     console.log(user);
        //                     userdata = user;
        //                     navigator.geolocation.getCurrentPosition(function(pos) {

        //                         var userlocation = {
        //                             'name': userdata.name,
        //                             'id': userdata.id,
        //                             'latitude': pos.coords.latitude,
        //                             'longitude': pos.coords.longitude
        //                         }

        //                         // var link="localhost/makenewaccount.php";
        //                         // $http.post(link, result.data).then(function (res){
        //                         // $scope.response = res.data;
        //                         var alllocations=[{lat: 30.7333, lng: 76.7794}, {lat: 27.363, lng: 71.044}, {lat: 24.363, lng: 90.044} ];
        //                         for (var i = 0; i < alllocations.length; i++) {
        //                         	var myLocation = new google.maps.Marker({
        //                         	position : alllocations[i],
        //                         	map : map,
        //                         	title: 'hello'
        //                         	});
        //                         }

        //                     });

        //                     $scope.user = user;
        //                 },

        //                 function(error) {
        //                     alert('Facebook error: ' + error.error_description);
        //                 });

        //         } else {
        //             alert('Facebook login failed');
        //         }
        //     });
        // ______________________________________________________________________________________________________________________________




        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            // var myLocation = new google.maps.Marker({
            //     position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            //     map: map,
            //     title: "My Location"
            // });
        });

        $scope.map = map;
    });

});