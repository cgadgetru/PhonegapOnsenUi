MainPageCtrl = ($scope)->
    ons.ready(()->
        # Init code here
        console.log 'MainPageCtrl ready'
        null
    )
    null

angular.module('my-app').controller('MainPageCtrl',['$scope', MainPageCtrl]);