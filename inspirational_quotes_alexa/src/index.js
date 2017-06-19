'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');
var querystring = require('querystring');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = "amzn1.ask.skill.4050fb4f-03cc-40e7-ae14-d2a0000308f8";

var SKILL_NAME = "Inspiration";
var GET_FACT_MESSAGE = "Here is your inspiration: ";
var HELP_MESSAGE = "You can say tell me something inspritational, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetInspiration');
    },
    'GetInspiration': function () {
        var randomFact = "";
        var that = this;
        var callback = function(response) {
          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            randomFact += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            var speechOutput = GET_FACT_MESSAGE + randomFact;
            console.log(speechOutput);
            that.emit(':tell', speechOutput)
            that.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)

          });
        }
        getQuote(callback);

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};

function getQuote(callback) {
  var options = {
    host: 'api.forismatic.com',
    path: '/api/1.0/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  var postData = querystring.stringify({
    "method": "getQuote",
    "format": "text",
    "lang": "en"
  });

  var request = http.request(options, callback)

  request.write(postData);
  request.end();
}
