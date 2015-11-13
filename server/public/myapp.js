var myApp = angular.module('myApp',[]);
myApp.controller('appController', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
  // $scope.counter = 0;
  function getCount () {
    $http({
      method: 'get',
      url: "/api/increment"
    })
    .then(function (result){
      $scope.counter = result.data;
    });
  }
  function getTemp() {
    $http({
      method: 'get',
      url: "/api/get-temp"
    })
    .then(function (result){
      $scope.temp_ws = result.data;
    });
  }
  function getAlexTemp() {
    $http({
      method: 'get',
      url: "/api/alexs-home-temp"
    })
    .then(function (result){
      $scope.temp_alex = result.data;
    });
  }
  $scope.click = function () {
    getCount();
  };
  getCount();
  getTemp();
  getAlexTemp();
  $interval (function() {
    getTemp();
    getAlexTemp();
  }, 1000);

  $scope.led_state = {
    red: 0,
    green: 0,
    yellow: 0
  };
  $scope.switch_led = function (led) {
    $scope.led_state[led] = !$scope.led_state[led];
    var url = '/api/change-led?led=' + led + '&state=' + $scope.led_state[led];
    $http ({
      method: 'get',
      url: url
    })
    .then(function (result) {
      console.log ('RESULT', result.data);
    });
  };
}]);
