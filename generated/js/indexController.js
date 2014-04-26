var PouexApp = angular.module("PouexApp", [ 'ngStorage' ]);

PouexApp.factory('PouexDataService', [ '$http', '$localStorage', '$q', function($http, $localStorage, $q) {

    var getData = function() {
        var deferred = $q.defer();

        $http({method:"GET", url:"model/index.json"}).success(function(data){
            // init local storage
    		//$storage = {game: data};
            $storage = $localStorage.$default({
              game: data
            });
            // resolve data
            deferred.resolve($storage);
        });

        return deferred.promise;
    };

    var reset = function(){
      delete $storage.game;
    };

    return { getData: getData, reset: reset };
}]);

PouexApp.controller('CtrlMenu', [ '$scope', '$http', 'PouexDataService', function($scope, $http, PouexDataService){
  
  // load model
  var myDataPromise = PouexDataService.getData();

  myDataPromise.then(function(result){
    $scope.$storage = result;
    //$scope.backup = JSON.parse(JSON.stringify(result.game));

      // state's activation
      $scope.$watchCollection("[ $storage.game.pouex.features['Happiness'].value ]", function(newValues, oldValues){
        if(typeof $scope.$storage.game != "undefined"){
          if(newValues[ 0 ] > 7.0){
                // state animation 
                $scope.$storage.game.pouex.body.face.imageUrl = 'imgs/face_happy.png';
              // set in model the activation
              $scope.$storage.game.pouex.states.Happy.active = true;
            
          }else{
               // state animation 
               $scope.$storage.game.pouex.body.face.imageUrl = $scope.$storage.game.pouex.body.face.default;
             // set in model the activation
             $scope.$storage.game.pouex.states.Happy.active = false;
          }
        }
      });

      
      // state's activation
      $scope.$watchCollection("[ $storage.game.pouex.features['Weight'].value, $storage.game.pouex.features['Happiness'].value ]", function(newValues, oldValues){
        if(typeof $scope.$storage.game != "undefined"){
          if(newValues[ 0 ] > 80.0 || newValues[ 1 ] < 0.1){
                // state animation 
                $scope.$storage.game.pouex.body.face.imageUrl = 'imgs/face_dead.png';
              // set in model the activation
              $scope.$storage.game.pouex.states.TheEnd.active = true;
            
          }else{
               // state animation 
               $scope.$storage.game.pouex.body.face.imageUrl = $scope.$storage.game.pouex.body.face.default;
             // set in model the activation
             $scope.$storage.game.pouex.states.TheEnd.active = false;
          }
        }
      });

        // catch state activation
        $scope.$watch("$storage.game.pouex.states['TheEnd'].active", function(){
          // if dead 
          if(this.last){
            // reset memory
            PouexDataService.reset();
            // end the game
            $('#state-dead').modal();
          }
        });  
      	
      // state's activation
      $scope.$watchCollection("[ $storage.game.pouex.features['Weight'].value, $storage.game.pouex.states['Happy'].active, $storage.game.pouex.features['Happiness'].value, $storage.game.pouex.features['Happiness'].value ]", function(newValues, oldValues){
        if(typeof $scope.$storage.game != "undefined"){
          if(( newValues[ 0 ] > 80.0 && !newValues[ 1 ] && ( newValues[ 2 ] < 7.0 || newValues[ 3 ] > 2.0 ) )){
              // set in model the activation
              $scope.$storage.game.pouex.states.Overweight.active = true;
            
          }else{
             // set in model the activation
             $scope.$storage.game.pouex.states.Overweight.active = false;
          }
        }
      });

      

    // execute a action: manipupate feature value
    $scope.executeAction = function(name){
      angular.forEach($scope.$storage.game.pouex.actions[ name ], function(value, key){
        var operation = value.operation;
        var operator = value.operator; 
        var fname = value.feature;
        var fvalue = $scope.$storage.game.pouex.features[ fname ].value;
        var fmax = $scope.$storage.game.pouex.features[ fname ].maximum;
        var fmin = $scope.$storage.game.pouex.features[ fname ].minimum;

        var ret = eval(fvalue + operator + operation);

        if(ret <= fmax && ret >= fmin){
          $scope.$storage.game.pouex.features[ fname ].value = ret;
        }
      });
    };

    // implement a repeated event
    

    // Compute a feature value transformation: from number to percetual value
    $scope.getFeaturePercValue = function(name){
      if(typeof($scope.$storage.game) === "undefined") return 0;
      return ($scope.$storage.game.pouex.features[name].value - $scope.$storage.game.pouex.features[name].minimum) * 100 / ($scope.$storage.game.pouex.features[name].maximum - $scope.$storage.game.pouex.features[name].minimum);
    };

  });

  $scope.PouexNewGame = function(){
    // reset memory
    PouexDataService.reset();
    // reload page
    $('#state-dead').modal();
  };
}]);
	
