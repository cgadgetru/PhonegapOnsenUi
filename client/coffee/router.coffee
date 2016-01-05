
angular.module('my-app').config(($stateProvider, $urlRouterProvider)->
    $urlRouterProvider.otherwise("/page1");
    $stateProvider
    .state('page1', {
        ###templateUrl: 'html/page.html',###
        url: "/page1"
    })
    .state('page2', {
        parent: 'page1',
        onEnter: ($rootScope) ->
            $rootScope.myNavigator.pushPage('page1.html');

        onExit:($rootScope)->
            $rootScope.myNavigator.popPage();
    })
    .state('page3', {
        parent: 'page2',
        onEnter: ($rootScope) ->
            $rootScope.myNavigator.pushPage('page2.html');

        onExit:($rootScope)->
            $rootScope.myNavigator.popPage();
    })
null
)