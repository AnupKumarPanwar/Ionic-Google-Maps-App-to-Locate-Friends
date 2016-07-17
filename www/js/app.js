// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    ngFB.init({appId: '1780520115500038'});
  });
})



.controller('MapController', function($scope, $ionicLoading, $interval, $ionicModal, $timeout, ngFB) {


  $scope.fbLogin = function () {

    var userdata ={}

    ngFB.login({scope: 'email, public_profile, publish_actions'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                
             


                  ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
        console.log(user);
        userdata=user;
        $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });




                // $scope.closeLogin();








            } else {
                alert('Facebook login failed');
            }
        });
  }



  

 
    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 20,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

 		

          $interval(function(){
              navigator.geolocation.getCurrentPosition(function(pos) {
                      var userlocation={'name':userdata.name, 'id' : userdata.id, 'latitude':pos.coords.latitude, 'longitude':pos.coords.longitude}

                      var link="localhost/makenewaccount.php";
        $http.post(link, result.data).then(function (res){
        $scope.response = res.data;
        
              });
          },10000)

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
    });
 
});