var PouexApp = angular.module("PouexApp", [ ]);

PouexApp.controller('CtrlMenu', function($scope, $http){
  // load model
  $http.get('model/index.json').success(function(data) {
    $scope.game = data;
  });

    // state's activation
    $scope.$watch("game.pouex.features['Happiness'].value", function(){ 
      if(this.last > 7.0){
            // state animation 
            $scope.game.pouex.body.face.imageUrl = 'imgs/face_happy.png';
          // set in model the activation
          $scope.game.pouex.states.Happy.active = true;
        
      }/*else{
            // state animation 
            $scope.game.pouex.body.face.imageUrl = $scope.game.pouex.body.face.default;
          // set in model the activation
          $scope.game.pouex.states.Happy.active = false;
      }*/
    });
    
    
    // state's activation
    $scope.$watch("game.pouex.features['Weight'].value", function(){ 
      if(this.last > 80.0){
            // state animation 
            $scope.game.pouex.body.face.imageUrl = 'imgs/face_dead.png';
          // set in model the activation
          $scope.game.pouex.states.TheEnd.active = true;
        
      }/*else{
            // state animation 
            $scope.game.pouex.body.face.imageUrl = $scope.game.pouex.body.face.default;
          // set in model the activation
          $scope.game.pouex.states.TheEnd.active = false;
      }*/
    });
    // state's activation
    $scope.$watch("game.pouex.features['Happiness'].value", function(){ 
      if(this.last < 0.1){
            // state animation 
            $scope.game.pouex.body.face.imageUrl = 'imgs/face_dead.png';
          // set in model the activation
          $scope.game.pouex.states.TheEnd.active = true;
        
      }/*else{
            // state animation 
            $scope.game.pouex.body.face.imageUrl = $scope.game.pouex.body.face.default;
          // set in model the activation
          $scope.game.pouex.states.TheEnd.active = false;
      }*/
    });
    
      // catch state activation
      $scope.$watch("game.pouex.states['TheEnd'].active", function(){ 
        if(this.last){
          // if dead, end the game
          $('#state-dead').modal();
        }
      });  
    	

  // execute a action: manipupate feature value
  $scope.executeAction = function(name){
     angular.forEach($scope.game.pouex.actions[ name ], function(value, key){
       var operation = value.operation;
       var operator = value.operator; 
       var fname = value.feature;
       var fvalue = $scope.game.pouex.features[ fname ].value;
       var fmax = $scope.game.pouex.features[ fname ].maximum;
       var fmin = $scope.game.pouex.features[ fname ].minimum;

       var ret = eval(fvalue + operator + operation);

       if(ret <= fmax && ret >= fmin){
          $scope.game.pouex.features[ fname ].value = ret;
       }
     });
  };

  // implement a repeated event
    var TiredTimer = setInterval(function(){
      $scope.executeAction('Tired');
      $scope.$apply();
    }, 2000.0);
    var the_weight_increasesTimer = setInterval(function(){
      $scope.executeAction('the_weight_increases');
      $scope.$apply();
    }, 1500.0);
  

  // Compute a feature value transformation: from number to percetual value
  $scope.getFeaturePercValue = function(name){
    if(typeof($scope.game) === "undefined") return 0;
    return ($scope.game.pouex.features[name].value - $scope.game.pouex.features[name].minimum) * 100 / ($scope.game.pouex.features[name].maximum - $scope.game.pouex.features[name].minimum);
  };
});
	
