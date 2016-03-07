/**
 * Created by allyshia on 2016-03-03.
 */

var app = require('../app');
var request = require('request');
var util = require('util');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var serviceConfig = require('../config/config').services;
var config = process.env.NODE_ENV == 'test' ? serviceConfig.test.mongo
    : process.env.NODE_ENV == 'development' ? serviceConfig.local.mongo
    : serviceConfig.production.mongo;

var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.db;

describe('Messages', function () {
    beforeEach(function (done) {
        console.log('Dropping Test DB');
        mongoose.connect(url, function(){
            mongoose.connection.db.dropDatabase(function(){
                done();
            })
        })
    });

    afterAll(function () {
        app.stopServer();
    });

    it('should create a message on a POST', function (done) {
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'some text' },
            json: true
        }, function (error, response, body) {
            expect(body.message).toBeDefined();
            expect(body.message.text).toBe('some text');
            done();
        });
    });

    it('should return a 400 (Bad Request) if no body in POST request', function (done) {
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            json: true
        }, function (error, response, body) {
            expect(body.error).toBeDefined();
            expect(body.error).toContain('You must provide non-empty message text.');
            done();
        });
    });

    it('should return a 400 (Bad Request) if POST body contains no text parameter', function (done) {
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: {},
            json: true
        }, function (error, response, body) {
            expect(body.error).toBeDefined();
            expect(body.error).toContain('You must provide non-empty message text.');
            done();
        });
    });

    it('should return all messages on a GET', function (done) {
        // Add some messages first
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'msg1' },
            json: true
        }, function (POSTerror1, POSTresponse1, POSTbody1) {
            request({
                url: 'http://localhost:3000/messages',
                method: 'POST',
                body: { text: 'msg2' },
                json: true
            }, function (POSTerror2, POSTresponse2, POSTbody2) {
                // Check that messages are findable
                request({
                    url: 'http://localhost:3000/messages',
                    method: 'GET',
                    json: true
                }, function (error, response, body) {
                    expect(body.messages.length).toBe(2);
                    expect(body.messages[0].text).toBe("msg1");
                    expect(body.messages[1].text).toBe("msg2");
                    done();
                });
            });
        });
    });

    it('should return a message on a GET by ID', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'msg1' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Get message by ID
            request({
                url: 'http://localhost:3000/messages/' + messageId,
                method: 'GET',
                json: true
            }, function (error, response, body) {
                expect(body.message).toBeDefined();
                expect(body.message.text).toBe("msg1");
                done();
            });
        });
    });

    it('should update a message on a PUT by ID', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'msg1' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Update message
            request({
                url: 'http://localhost:3000/messages/' + messageId,
                method: 'PUT',
                body: { text: 'updatedMsg1' },
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);

                // Verify that the message has been updated
                request({
                    url: 'http://localhost:3000/messages',
                    method: 'GET',
                    json: true
                }, function (error, response, body) {
                    expect(body.messages.length).toBe(1);
                    expect(body.messages[0].text).toBe("updatedMsg1");
                    done();
                });
            });
        });
    });

    it('should return a 400 on a PUT with no text property in the request body', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'msg1' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Update message
            request({
                url: 'http://localhost:3000/messages/' + messageId,
                method: 'PUT',
                body: { foo: 'bar' },
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });

    it('should return a 400 on a PUT with an empty string as text property in the request body', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'msg1' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Update message
            request({
                url: 'http://localhost:3000/messages/' + messageId,
                method: 'PUT',
                body: { text: '' },
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });

    it('should remove a message on a DELETE by ID', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'msg1' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Delete message by ID
            request({
                url: 'http://localhost:3000/messages/' + messageId,
                method: 'DELETE',
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);

                // Verify that the message has been deleted
                request({
                    url: 'http://localhost:3000/messages',
                    method: 'GET',
                    json: true
                }, function (error, response, body) {
                    expect(body.messages.length).toBe(0);
                    done();
                });
            });
        });
    });

    it('should return a 404 error response for a GET on message that doesn\'t exist', function (done) {
        request({
            url: 'http://localhost:3000/messages/56db10aded0427f90d0210ca',
            method: 'GET',
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it('should return a 404 error response for a GET on a message with an invalid ID', function (done) {
        request({
            url: 'http://localhost:3000/messages/someArbitraryTextThatIsntAValidID',
            method: 'GET',
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it('should return a 404 error response for a PUT on message that doesn\'t exist', function (done) {
        request({
            url: 'http://localhost:3000/messages/56db10aded0427f90d0210ca',
            method: 'PUT',
            body: { text: "test" },
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it('should return a 404 error response for a PUT message with an invalid ID', function (done) {
        request({
            url: 'http://localhost:3000/messages/someArbitraryTextThatIsntAValidID',
            method: 'PUT',
            body: { text: "test" },
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it('should return a 404 error response for a DELETE on message that doesn\'t exist', function (done) {
        request({
            url: 'http://localhost:3000/messages/56db10aded0427f90d0210ca',
            method: 'DELETE',
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it('should return a 404 error response for a DELETE message with an invalid ID', function (done) {
        request({
            url: 'http://localhost:3000/messages/someArbitraryTextThatIsntAValidID',
            method: 'DELETE',
            json: true
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it('should return an object describing that a palindrome message is a palindrome when queried', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'racecar' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Send isPalindrome query
            request({
                url: 'http://localhost:3000/messages/' + messageId + '/query?params=isPalindrome',
                method: 'GET',
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(body.queryResult).toBeDefined();
                expect(body.queryResult.isPalindrome).toBe(true);
                done();
            });
        });
    });

    it('should return an object describing that a palindrome message is NOT a palindrome when queried', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'racecars' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Send isPalindrome query
            request({
                url: 'http://localhost:3000/messages/' + messageId + '/query?params=isPalindrome',
                method: 'GET',
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(body.queryResult).toBeDefined();
                expect(body.queryResult.isPalindrome).toBe(false);
                done();
            });
        });
    });

    it('should return a 400 response if an invalid query parameter is provided', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'racecars' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Send invalid query
            request({
                url: 'http://localhost:3000/messages/' + messageId + '/query?params=invalidQueryParam',
                method: 'GET',
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });

    it('should return a 400 response if no query parameter is provided', function (done) {
        // Add a message
        request({
            url: 'http://localhost:3000/messages',
            method: 'POST',
            body: { text: 'racecars' },
            json: true
        }, function (POSTerror, POSTresponse, POSTbody) {
            var messageId = POSTbody.message.id;

            // Send invalid query
            request({
                url: 'http://localhost:3000/messages/' + messageId + '/query',
                method: 'GET',
                json: true
            }, function (error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });
});