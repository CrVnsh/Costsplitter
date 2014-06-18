function GroupController ($scope, $log, $http, $location, MainFactory)
{
    $log.log ("controller für View wurde erstellt");

  	$http.get("/api/groups").success(function(data) {
    	$scope.groups = data;
    });


	$scope.addGroup = function() {
		$scope.show = false;
		var name = $scope.newGroupName;
		if (name != null) {

		 $http({
		    url: '/api/groups',
		    method: "POST",
		    data: { 'name' : name}
		}).success(function(data){
			$scope.groups = data;
			$scope.newGroupName = "";
		});
		$('#newGroup').modal('hide');
	}else{
		$scope.show = true;
	}

	}

	$scope.pressEnter = function(event, param) {

		if(event.which == 13) {
			if(param == "add"){

				$scope.addGroup();	
				
			}
			else
			{
				$scope.editGroup();	
				
			}
		}
	}

	$scope.editGroup = function() {
		$scope.show = false;
		var name = $scope.editGroupName;
		var id = MainFactory.getGroupID();
		if (name != null) {

		$http({
		    url: '/api/groups/'+ id,
		    method: "put",
		    data: { 'name' : name }
		}).success(function(data){
			$scope.groups = data;
			$scope.editGroupName = "";
			$('#editGroup').modal('hide');
		});
	}else{
		$scope.show = true;
	}
	}

	$scope.removeGroup = function(id) {
		$http({
		    url: '/api/groups/'+ id,
		    method: "delete",
		    data: { '_id' : id }
		}).success(function(data){
			$scope.groups = data;
			/*(function(id){
				$http({
				url: '/api/persons/'+id,
				method: "delete",
				data: { 'group_id': id}
			}).success(function(data){
				$scope.persons = data;
				(function(id){
				$http({
				url: '/api/personexpenses/' + id,
				method: "delete",
				data: { 'person_id': id}
				});
			})(id);
			});
			} */
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
        $scope.personExpenses = new Array();
        $scope.personDeltas = new Array();

		$http({
				url: '/api/persons/'+ groupid,
				method: "GET",
			}).success(function(data){
				$scope.persons = data;
                $scope.counter = 0;
                $scope.overallSum = 0;
                var index = 0;
                for(index = 0; index < data.length; index++) {
                    (function(i, d) {
                   $http({
                        url: '/api/expenses/'+ d[i]._id,
                        method: "GET",
                    }).success(function(expenses){
                           var sum = 0;
                           var expIndex = 0;
                           for(expIndex = 0; expIndex < expenses.length; expIndex++) {
                               sum = sum + expenses[expIndex].value;
                           }
                           $scope.personExpenses[d[i]._id] = sum;
                           $scope.counter = $scope.counter + 1;
                           if($scope.counter == d.length) {
                             var c = 0;
                             for(c = 0; c < d.length; c++) {
                                 $scope.overallSum = $scope.overallSum + $scope.personExpenses[d[c]._id];
                             }
                             for(c = 0; c < d.length; c++) {
                                 $scope.personDeltas[d[c]._id] = $scope.personExpenses[d[c]._id] - ($scope.overallSum/$scope.persons.length);
                                 if($scope.personDeltas[d[c]._id] > 0) {
                                     $scope.personDeltas[d[c]._id] = "+" + $scope.personDeltas[d[c]._id];
                                 } else {
                                     $scope.personDeltas[d[c]._id] = "" + $scope.personDeltas[d[c]._id];
                                 }
                             }
                           }
                       });
                    })(index, data);
                }
			});
	}

	$scope.pressEnter = function(event, query) {

		if(event.which == 13) {

			
			$scope.addPerson();
			
		}
	}

	$scope.stylegen = function(value){
		if (value < 0 ) {
			return "red";
		}else
			return "green";
	}


	$scope.addPerson = function() {
		$scope.show = false;
		var name = $scope.addPersonName;
		if (name !=null) {
		 $http({
		    url: '/api/persons',
		    method: "POST",
		    data: { 'name' : name,
		    		'groupid' : groupid }
		}).success(function(data){
			$scope.persons = data;
			$scope.addPersonName = "";
			$('#newPerson').modal('hide');
		});
		}
		else{
			$scope.show = true;
		}
	}

	$scope.removePerson = function(id) {

		$http({
				url: '/api/persons/'+id+'/'+groupid,
				method: "delete",
				data: { 'person_id' : id,
						'group_id': groupid}
			}).success(function(data){
				$scope.persons = data;
				(function(id){
				$http({
				url: '/api/personexpenses/' + id,
				method: "delete",
				data: { 'person_id': id}
				});
			})(id);
			});

		
				
	}

	$scope.goToPerson = function(id, name) {

		PersonFactory.setPersonID(id);
		PersonFactory.setPersonName(name);
		$location.path("/person");

	}

    $scope.goToCostsplit = function(){
//        MainFactory.setGroupID(id);
//        MainFactory.setGroupName(name);
        $location.path("/costsplit");
    }

    $scope.sumExpenses = function(id){

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

	$scope.pressEnter = function(event) {

		if(event.which == 13) {

			$scope.addExpense();
		}
	}

	
	// Ausgabe der Person hinzufügen
	$scope.addExpense = function() {
		$scope.show = false;
		var descr = $scope.expenseDescr;
		var value = $scope.expenseValue;
		var date = $scope.expenseDate;

		if (descr != null && value != null && date != null) {
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
		$('#newExpense').modal('hide');}else
	{
		$scope.show = 	true;
	}
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
