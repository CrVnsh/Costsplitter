/**
 * Created by Philip on 09.05.2014.
 */
var app = angular.module('app', ['ngRoute', 'appRoutes', 'app.ctrl', 'factory'])
	.directive('a', function() {
	    return {
	        restrict: 'E',
	        link: function(scope, elem, attrs) {
	            if(attrs.toggle){
	                elem.on('click', function(e){
	                    e.preventDefault();
	                });
	            }
	        }
	   };
	})

        .run ( function ($log) {
            $log.log("module wurde erstellt");
    });

        

