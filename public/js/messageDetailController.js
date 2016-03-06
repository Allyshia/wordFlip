app.controller('MessageDetailController', ['$scope', '$routeParams', 'WordFlipService',
    function ($scope, $routeParams, WordFlipService) {
        $scope.messageId = $routeParams.messageId;
        $scope.message;

        WordFlipService.getMessageById($scope.messageId, function (error, message) {
            if (error) {
                console.log('ERROR getting messages: ' + error);
            }
            else {
                console.log('GOT messages: ' + JSON.stringify(message));
                $scope.message = message;
            }
        });
    }]);