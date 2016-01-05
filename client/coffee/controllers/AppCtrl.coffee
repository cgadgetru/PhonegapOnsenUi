AppCtrl = ($scope)->
    ons.ready(()->
        # Init code here
        console.log 'ons ready'
        null
    )
    null

angular.module('my-app').controller('AppCtrl',['$scope', AppCtrl]);

