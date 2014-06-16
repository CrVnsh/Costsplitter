function GroupController ($scope, $log, $http, $location, MainFactory)
{
    $log.log ("controller für View wurde erstellt");

  	$http.get("/api/groups").success(function(data) {
    	$scope.groups = data;
    });


	$scope.addGroup = function() {

		var name = $scope.newGroupName;
		 $http({
		    url: '/api/groups',
		    method: "POST",
		    data: { 'name' : name}
		}).success(function(data){
			$scope.groups = data;
			$scope.newGroupName = "";
		});

	}

	$scope.editGroup = function() {
		var name = $scope.editGroupName;
		var id = MainFactory.getGroupID();
		$http({
		    url: '/api/groups/'+ id,
		    method: "put",
		    data: { 'name' : name }
		}).success(function(data){
			$scope.groups = data;
			$scope.editGroupName = "";
		});
	}

	$scope.removeGroup = function(id) {
		$http({
		    url: '/api/groups/'+ id,
		    method: "delete",
		    data: { '_id' : id }
		}).success(function(data){
			$scope.groups = data;
		});
	}

	$scope.goToGroup = function(id, name) {

		MainFactory.setGroupID(id);
		MainFactory.setGroupName(name);
		$location.path("/group");

	

	}

	$scope.idSaveGroup = function(id) {
		MainFactory.setGroupID(id);
	}




}

function personController ($scope,$log, $http, $location, MainFactory , PersonFactory) {
	var groupid = MainFactory.getGroupID();

	$scope.groupInit = function() {
		$scope.groupName = MainFactory.getGroupName();

		$http({
				url: '/api/persons/'+ groupid,
				method: "GET",
			}).success(function(data){
				$scope.persons = data;
			});
	}

	


	$scope.addPerson = function() {

		var name = $scope.addPersonName;

		 $http({
		    url: '/api/persons',
		    method: "POST",
		    data: { 'name' : name,
		    		'groupid' : groupid }
		}).success(function(data){
			$scope.persons = data;
			$scope.addPersonName = "";
		});
	}

	$scope.removePerson = function(id) {
		$http({
				url: '/api/persons/'+id+'/'+groupid,
				method: "delete",
				data: { 'person_id' : id,
						'group_id': groupid}
			}).success(function(data){
				$scope.persons = data;
			});
				
	}

	$scope.goToPerson = function(id, name) {

		PersonFactory.setPersonID(id);
		PersonFactory.setPersonName(name);
		$location.path("/person");

	

	}
}
function expensesController ($scope, $http, PersonFactory, ExpensesFactory){

	var personid = PersonFactory.getPersonID();

	//Person Namen erhalten und Ausgaben der Person erhalten
	$scope.personInit = function() {
		$scope.personName = PersonFactory.getPersonName();
	
		$http({
				url: '/api/expenses/'+ personid,
				method: "GET",
			}).success(function(data){
				$scope.expenses = data;
			});
	}

	
	// Ausgabe der Person hinzufügen
	$scope.addExpense = function() {

		var descr = $scope.expenseDescr;
		var value = $scope.expenseValue;
		var date = $scope.expenseDate;

		 $http({
		    url: '/api/expenses',
		    method: "POST",
		    data: { 'descr' : descr,
		    		'value' : value,
		    		'date'  : date,
		    		'personid' : personid }
		}).success(function(data){
			$scope.expenses = data;
			$scope.expenseDescr = "";
			$scope.expenseValue = "";
			$scope.expenseDate = "";
		});
	}

	// Ausgabe der Person entfernen
	$scope.removeExpense = function() {

		var id = ExpensesFactory.getExpenseID();

		$http({
				url: '/api/expenses/'+ id +'/'+ personid,
				method: "delete",
				data: { 'expense_id' : id,
						'person_id': personid}
			}).success(function(data){
				$scope.expenses = data;
			});
				
	}

    $scope.idSaveExpense = function(id, descr, value, date) {   

		ExpensesFactory.setExpenseID(id);
		$scope.expenseInfoDescr = descr;
		$scope.expenseInfoValue = value;
		$scope.expenseInfoDate = date;
	
	}
}
var ctrl = angular.module('app.ctrl', [])
    .controller('GroupController', GroupController)
    .controller('personController', personController)
    .controller('expensesController', expensesController)
;
