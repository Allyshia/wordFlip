app.controller('MessageMainController', ['$scope', 'WordFlipService',
    function ($scope, WordFlipService) {
        $scope.text = '';
        $scope.messages = [];

        WordFlipService.getAllMessages(function (error, messages) {
            if (error) {
                console.log('ERROR getting messages: ' + error);
            }
            else {
                console.log('GOT messages: ' + JSON.stringify(messages));
                $scope.messages = messages.concat($scope.messages);
            }
        });

        $scope.addMessage = function () {
            var text = $scope.text;

            // Add message
            WordFlipService.addMessage(text, function (error, message) {
                if (error) {
                    console.log('ERROR saving text: ' + error);
                }
                else {
                    console.log('SAVED: ' + JSON.stringify(message));
                    $scope.messages.unshift(message);
                    $scope.text = '';
                }
            });
        }
    }]);