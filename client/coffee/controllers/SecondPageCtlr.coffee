SecondPageCtlr = ($scope)->
    ons.ready(()->
        # Init code here
        console.log 'SecondPageCtlr ready'
        null
    )
    null

angular.module('my-app').controller('SecondPageCtlr',['$scope', SecondPageCtlr]);