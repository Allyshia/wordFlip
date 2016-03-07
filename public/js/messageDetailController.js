app.controller('MessageDetailController', ['$scope', '$routeParams', 'WordFlipService',
    function ($scope, $routeParams, WordFlipService) {
        $scope.messageId = $routeParams.messageId;
        $scope.message;
        $scope.editing = false;
        $scope.displayedText = '';
        $scope.inputHelpMessage = '';
        $scope.hasError = false;
        $scope.isPalindrome;

        WordFlipService.getMessageById($scope.messageId, function (error, message) {
            if (error) {
                console.log('ERROR getting messages: ' + error);
            }
            else {
                console.log('GOT messages: ' + JSON.stringify(message));
                $scope.message = message;
                $scope.displayedText = message.text;
            }
        });

        $scope.getMessageDetails = function () {
            WordFlipService.getMessageDetails($scope.messageId, ['isPalindrome'], function (error, queryResult) {
                if (error) {
                    console.log('ERROR getting messages: ' + error);
                }
                else {
                    $scope.isPalindrome = queryResult.isPalindrome ? "YES" : "NO";
                }
            });
        };

        $scope.getMessageDetails();

        $scope.startEditing = function () {
            if (!$scope.editing) {
                $scope.editing = true;
            }
        };

        $scope.stopEditing = function () {
            if ($scope.editing) {
                $scope.editing = false;
                $scope.hasError = false;
                $scope.inputHelpMessage = '';
            }
        };

        $scope.updateMessage = function () {
            $scope.editing = false;
            WordFlipService.updateMessageById($scope.messageId, $scope.displayedText, function (error, message) {
                if (error) {
                    $scope.inputHelpMessage = 'There was an error saving this message text.'; // TODO improve msg
                    $scope.displayedText = $scope.message.text;
                    $scope.hasError = true;
                    $scope.editing = true;
                }
                else {
                    console.log("SAVED!");
                    $scope.message = message;

                    // Refresh palindrome status
                    $scope.getMessageDetails();
                }
            });
        };
    }]);