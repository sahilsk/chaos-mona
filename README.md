This is our simpler implementation of the [Chaos Monkey](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html).

It is a daemon that screw things randomly on our infrastructure to ensure reliability.


## Installation

~~~
git clone git@github.com:auth0/chaos-monkey.git
npm i
~~~

## Configuration

The configuration define two important pieces:
- tasks
- nodes

A task is a command to run in the target server. It is defined by two attributes `name` and `cmd`. A task can be defined either on an specific node, a class of nodes, or all nodes.

A node is the server where the command should be run.

Example `brain_memory.yaml`

```yaml
global tasks:
  - name: power off <node.name>
    cmd: sudo poweroff
  - name: reboot <node.name>
    cmd: sudo reboot

classes:
  app:
    tasks:
      - name: restart the application service
        cmd: sudo service application restart
      - name: restart the nginx service
        cmd: sudo service nginx restart
  db:
    tasks:
      - name: stop the mongod service
        cmd: sudo service mongod stop

nodes:
  - name: app-1
    class: app
    ssh_config:
      port: 222
      host: myapp.mycompany.com
      privateKey: /etc/chaos_key
      username: chaos
  - name: app-2
    class: app
    ssh_config:
      port: 222
      host: myapp.mycompany.com
      privateKey: /etc/chaos_key
      username: chaos
  - name: app-3
    class: app
    tasks:
      - name: stop rabbitmq
        cmd: sudo service rabbitmq stop
    ssh_config:
      port: 222
      host: myapp.mycompany.com
      privateKey: /etc/chaos_key
      username: chaos
  - name: db-01
    class: db
    ssh_config:
      port: 222
      host: myapp.mycompany.com
      privateKey: /etc/chaos_key
      username: chaos
  - name: db-02
    class: db
    ssh_config:
      port: 222
      host: myapp.mycompany.com
      privateKey: /etc/chaos_key
      username: chaos
```

The `ssh_config` part is optional, if you already have a `~/.ssh/config` file it will match the node names with the host setting.

Additional environment variables:

-  `SLACK_INCOMING_URL`: optional. The monkey will use this url to post messages to an slack channel.
-  `BRAIN_FILE`: optional. Path to the brain file, by default it is `brain_memory.yaml` on the root of the directory.

## License

MIT - Auth0 Inc 2014