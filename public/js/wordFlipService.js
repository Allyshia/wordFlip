app.service('WordFlipService', function ($http) {
    this.addMessage = function (text, callback) {
        $http.post('/messages', { text: text }).then(function (response) {
            callback(null, response.data.message);
        }, function (error) {
            callback(error, null);
        });
    };

    this.getAllMessages = function (callback) {
        $http.get('/messages').then(function (response) {
            callback(null, response.data.messages);
        }, function (error) {
            callback(error, null);
        });
    };

    this.getMessageById = function (id, callback) {
        $http.get('/messages/' + id).then(function (response) {
            callback(null, response.data.message);
        }, function (error) {
            callback(error, null);
        });
    };

    this.updateMessageById = function (id, newText, callback) {
        $http.put('/messages/' + id, { text: newText }).then(function (response) {
            callback(null, response.data.message);
        }, function (error) {
            callback(error, null);
        });
    };
});