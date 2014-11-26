var mouth = module.exports;
var slack = require('./slack');

function say (message) {
  console.log(message);
  slack.say(message);
}

function phrase_action_message (action) {
  if (~action.task.name.indexOf('<node.name>')) {
    return action.task.name.replace('<node.name>', action.node.name);
  }
  return action.task.name + ' on ' + action.node.name;
}

var greeting_messages = [
  'ready to dance my song?',
  'ready to eat butterflies?',
  'ready to eat bananas?',
  'yesterday was fun but today is going to be crazy',
  'Did you do your homework?',
  'Is there a better moment than now to screw up your things?',
  'Let me introduce my self: I\'m the evil of cloud computing.',
  'You failed so bad yesterday, I hope you have improved your infrastracture.'
];

var end_messages = [
  'That\'s all.',
  'Good bye my friends!',
  'Adios amigos',
  'Good bye, thank netflix for this.'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

mouth.greet = function (action) {
  var message = 'Hello! ' + greeting_messages[getRandomInt(0, greeting_messages.length)] + ' ' +
                'I\'m going to ' + phrase_action_message(action);
  say(message);
};

mouth.goodbye = function () {
  var message = end_messages[getRandomInt(0, end_messages.length)];
  say(message);
};

mouth.server_says = function (what) {
  say('the server says: ' + what);
};