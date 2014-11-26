var async = require('async');
var request = require('request');

var queue = async.queue(function (message, callback) {
  request.post({
      url: process.env.SLACK_INCOMING_URL,
      json: {
        text: message,
        channel: '#general',
        icon_emoji: ':monkey_face:'
      }
  }, function () {
    callback();
  });
}, 1);

exports.say = function (message) {
  if (!process.env.SLACK_INCOMING_URL) return;
  queue.push(message);
};