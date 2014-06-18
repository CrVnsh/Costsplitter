var factory = angular.module('factory', [])
factory.factory('MainFactory', function($rootScope, $http){
    
    var group = {};
    var GroupID;
    

    group.setGroupID = function(id) {
        GroupID = id;
    }

    group.getGroupID = function() {
        return GroupID;
    }

    group.setGroupName = function(name) {
        GroupName = name;
    }

    group.getGroupName = function() {
        return GroupName;
    }

   

    return group ;      
});

factory.factory('PersonFactory' , function($rootScope , $http){
    var person = {};
    var PersonID;

     person.setPersonID = function(id){
        PersonID = id;
    }

    person.getPersonID = function() {
        return PersonID;
    }

    person.setPersonName = function(name) {
        PersonName = name;
    }

    person.getPersonName = function() {
        return PersonName;
    }

    return person;
});

factory.factory('ExpensesFactory' , function($rootScope , $http){
    var expense = {};
    var ExpenseID;

     expense.setExpenseID = function(id){
        ExpenseID = id;
    }

    expense.getExpenseID = function() {
        return ExpenseID;
    }

      expense.setExpenseValue = function(value){
        ExpenseValue = value;
    }

    expense.getExpenseValue = function() {
        return ExpenseValue;
    }

    return expense;
});