// Initialize Firebase
var firebase = firebase.initializeApp({
	apiKey: "AIzaSyDTq31jc44cEWcM4u0PDXouqVfwP5SNiFw",
	authDomain: "nashvillebarcamp.firebaseapp.com",
	databaseURL: "https://nashvillebarcamp.firebaseio.com",
	projectId: "firebase-nashvillebarcamp",
	storageBucket: "firebase-nashvillebarcamp.appspot.com",
	messagingSenderId: "248645383569"
});

angular.module('BarcampApp',[
	'ngRoute',
	'firebase',
	'webStorageModule'
])

.config([ '$routeProvider', '$httpProvider',
		function ($routeProvider, $locationProvider) {

			$routeProvider
/*//adds home route
				.when('/', {
					templateUrl : '/templates/home.html',
					allowAnonymousAccess:false,
				})*/
				.when('/admin', {
					templateUrl : '/templates/admin.html',
					controller : 'AdminCtrl',
					allowAnonymousAccess:false,
					adminAccess: true,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
				})
				.when('/fullschedule', {
					templateUrl : '/templates/fullschedule.html',
					controller : 'FullScheduleCtrl',
					allowAnonymousAccess:false
/*
					adminAccess: true,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
*/
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingCtrl',
					allowAnonymousAccess:false,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
				}).when('/login', {
					templateUrl : '/templates/signin.html',
					controller : 'SigninCtrl',
					allowAnonymousAccess:true
				})
				.when('/logout', {
					redirectTo:'/login',
					allowAnonymousAccess:true
				})
				.otherwise({
					redirectTo:'/sessions'
				});
		}
])
.run(function ($rootScope, $location) {

});
