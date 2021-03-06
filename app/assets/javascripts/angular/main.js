var app = angular.module("MyApp", ['Devise']);

app.config(function(AuthProvider) {

});

app.controller("TestCtrl",function(Auth, $scope) {
  $scope.currentUser = false;
  $scope.signup = "0";
  $scope.message = "";

  $scope.credentials_login = {
      email: '',
      password: ''
  };

  $scope.credentials_signup = {
  	  first_name:'',
  	  last_name:'',
      email: '',
      phone_number:'',
      password: '',
      password_confirmation: ''
  };

  $scope.submitLogin = function () {
    var config_login = {
	  headers: {
	    'X-HTTP-Method-Override': 'POST'
	    }
	};

	if (Object.keys($scope.loginform.$error).length != 0)
      return false;
    
	Auth.login($scope.credentials_login, config_login).then(function(user) {
	    console.log(user); // => {id: 1, ect: '...'}
	    $scope.currentUser = user;
	    $scope.message = "Logged in successfully!";
	    angular.element("#infodiv").removeClass("alert-danger");
	    angular.element("#infodiv").removeClass("alert-info");
	    angular.element("#infodiv").addClass("alert-success");
	    angular.element("#flash_notice").html($scope.message);
	
	  }, function(error) {
	  // Authentication failed...
	    $scope.message = error.data.error;
	    $scope.message = "Invalid email or password!";
	    angular.element("#infodiv").removeClass("alert-success");
	    angular.element("#infodiv").removeClass("alert-info");
	    angular.element("#infodiv").addClass("alert-danger");
	    angular.element("#flash_notice").html($scope.message);	      
	  });
	}


  $scope.sign_up = function() {
   	angular.element('#errdiv p').html('');
    $scope.signup = "1";
    $scope.message = '';
    angular.element('#titlediv h3').html("Sign up");
  }


  $scope.submitSignup = function() {
    var config_signup = {
      headers: {
        'X-HTTP-Method-Override': 'POST'
      }
    };

    if (Object.keys($scope.signform.$error).length != 0)
      return false;
    
   	Auth.register($scope.credentials_signup, config_signup).then(function(registeredUser) {
      console.log(registeredUser); // => {id: 1, ect: '...'}
      $scope.signup = "0";
      $scope.message = "You have to confirm your email address before continuing.";
	  angular.element("#infodiv").addClass("alert-success");
	  angular.element("#infodiv").removeClass("alert-danger");
	  angular.element("#infodiv").removeClass("alert-info");
	  angular.element("#flash_notice").html($scope.message);	  
      
  	}, function(error) {
      // Registration failed...
      console.log(error);
      $scope.message = "Email has already been taken";
	  angular.element("#infodiv").removeClass("alert-success");
	  angular.element("#infodiv").addClass("alert-danger");
	  angular.element("#infodiv").removeClass("alert-info");
	  angular.element("#flash_notice").html($scope.message);	 
  	});
  }

  $scope.submitBack = function() {
  	angular.element('#errdiv p').html('');
  	$scope.message = "You need to sign in or sign up before continuing.";

    angular.element("#infodiv").removeClass("alert-success");
    angular.element("#infodiv").removeClass("alert-danger");
    angular.element("#infodiv").addClass("alert-info");
    angular.element("#flash_notice").html($scope.message);	  
  	$scope.signup = "0";
  }

  $scope.submitLogout = function() {
  	var config_logout = {
      headers: {
        'X-HTTP-Method-Override': 'DELETE'
      }
    };
    // Log in user...
    // ...
    Auth.logout(config_logout).then(function(oldUser) {
      $scope.currentUser = false;
      $scope.message = "Logged out successfully!";
      angular.element("#infodiv").addClass("alert-success");
	  angular.element("#infodiv").removeClass("alert-danger");
	  angular.element("#infodiv").removeClass("alert-info");
	  angular.element("#flash_notice").html($scope.message);

    }, function(error) {
        // An error occurred logging out.
      $scope.message = error.data.error;
    });  	
  }

	Auth.currentUser().then(function(user) {
      // User was logged in, or Devise returned
      // previously authenticated session.
      console.log(user); // => {id: 1, ect: '...'}
      // console.log(Auth._currentUser);
      // console.log(Auth.isAuthenticated());
      $scope.currentUser = user;
    }, function(error) {

  	  $scope.message = "You need to sign in or sign up before continuing.";

      angular.element("#infodiv").removeClass("alert-success");
      angular.element("#infodiv").removeClass("alert-danger");
      angular.element("#infodiv").addClass("alert-info");
      angular.element("#flash_notice").html($scope.message);	      
      // unauthenticated error
  });
});

app.controller("ProfileCtrl", ['$scope','$http', 'Auth', function($scope, $http, Auth) {
	$scope.message = '';
	$scope.user = {};

	Auth.currentUser().then(function(user){
	  $scope.user = user;
	});

	$scope.submitUpdate = function() {
      if (Object.keys($scope.editform.$error).length != 0)
    	return false;

	  $http({
		  method: 'PATCH',
		  url: '/users.json',
		  data: { user: $scope.user }
		}).success(function(data){
		  console.log(data);
		  $scope.message = "Edit user successfully!";
	      angular.element("#infodiv").addClass("alert-success");
    	  angular.element("#infodiv").removeClass("alert-danger");
          angular.element("#flash_notice").html($scope.message);	 
			
		}).error(function(error){
		  console.log(error);
		  $scope.message = "Email has already been taken or current password is invalid.";

          angular.element("#infodiv").removeClass("alert-success");
          angular.element("#infodiv").addClass("alert-danger");
          angular.element("#flash_notice").html($scope.message);	 
		});	
	}
}]);