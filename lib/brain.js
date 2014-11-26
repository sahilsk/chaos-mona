var brain = module.exports;
var fs = require('fs');
var path = require('path');

var ssh_parser = require('ssh-config-parser');
var ssh_config_file = path.join(process.env.HOME, '/.ssh/config');
var ssh_config = fs.existsSync(ssh_config_file) ? ssh_parser(fs.readFileSync(ssh_config_file, 'utf8')) : null;

var yaml = require('js-yaml');
var brain_memory_file = process.env.BRAIN_FILE || path.join(__dirname, '../brain_memory.yaml');
var brain_memory = yaml.safeLoad(fs.readFileSync(brain_memory_file, 'utf8'));


brain_memory.nodes = brain_memory.nodes.map(function (node) {
  if (!ssh_config) return;
  if (node.ssh_config) return;

  var config = ssh_config.filter(function (ssh) {
    return ssh.Host === node.name;
  })[0];

  if (!config) return node;

  node.ssh_config = {
    host: config.HostName || config.Hostname,
    username: config.User,
    privateKey: fs.readFileSync(config.IdentityFile || path.join(process.env.HOME, '/.ssh/id_rsa')),
    passphrase: 'gitpass',
    port: config.Port || config.port
  };

  return node;
}).filter(function (node) {
  return !!node.ssh_config;
}).map(function add_tasks (node) {
  node.tasks = (node.tasks || [])
                  .concat(brain_memory.classes[node['class']].tasks)
                  .concat(brain_memory['global tasks']);
  return node;
});


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

brain.memory = brain_memory;

brain.choose = function () {
  var node = brain_memory.nodes[getRandomInt(0, brain_memory.nodes.length)];
  var task = node.tasks[getRandomInt(0, node.tasks.length)];
  return {
    node: node,
    task: task
  };
};