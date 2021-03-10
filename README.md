# Backend scalability example

Short example of how to scale web sockets using [socket io](https://socket.io/), [redis](https://redis.io/) as message broker with PubSub feature and [nginx](https://nginx.org/en/) or [haproxy](https://www.haproxy.org/) as load balancers for multiple node servers.

## How to run

First you need have install [Docker](https://www.docker.com/) and docker-compose utility for you to be able build the backend image and run the application inside of containers.

To build the backend image you need to run the following command:

```bash
docker build -t sockets-scalability-example .
```

The `sockets-scalability-example` tag can be changes as long that you reference it on docker-compose.yml file under the ws properties.

Then you just need to spin up the other services which the following command does for you:

```bash
docker-compose up
```

You should see a log from docker compose logs similar to:

```bash
ws2_1    | 2222 is listening on port: 2222
ws4_1    | 4444 is listening on port: 4444
ws3_1    | 3333 is listening on port: 3333
ws1_1    | 1111 is listening on port: 1111
ws1_1    | new connection was made server 1111
ws1_1    | Server 1111 join successfully to chat room!
ws2_1    | new connection was made server 2222
ws2_1    | Server 2222 join successfully to chat room!
ws2_1    | server 2222 received a message
ws1_1    | server 1111 received a message
```

The order and port numbers that you see may differ since we are running the load balancer as round robin approach, randomly distributing the traffic throughout our 4 servers.

After server is running open two different windows on a browser of your choice a go to `127.0.0.0:8080` and open the browser console. You should see a message in both windows like:

```bash
ws connected
```

Now you can try to send a chat message on both window consoles executing this command:

```bash
ws.emit('chat', "Hello! I'm client")
```

You will notice that both messages will appear despite that we have multiple servers, and each message containes the APP_ID respectively of who was the sender :)

The command is sending a `chat` event to the ws server which is listening to that event and broadcasts another `chat-message` event but only for the clients ws that joined to a room name `chat`.

When we are responding to the http request, for testing purposos, we are sending back a portion of `html` which handles the socket io connection initialization and subscribes/listen for `chat-message` events on the client side.

You can play around with the load balancer choice since we have example for nginx or haproxy. Feel free to change and use which one feels better to you.

Happy coding!

Rúben Gomes
