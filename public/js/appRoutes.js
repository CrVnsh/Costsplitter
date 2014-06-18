	angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'GroupController'
		})

		// group page
		.when('/group', {
			templateUrl: 'views/group.html',
			controller: 'personController'
		})

				// group page
		.when('/person', {
			templateUrl: 'views/person.html',
			controller: 'expensesController'
		})

        // costsplit page
        .when('/costsplit', {
            templateUrl: 'views/costsplit.html',
            controller: 'personController'
        })


	$locationProvider.html5Mode(true);

}]);