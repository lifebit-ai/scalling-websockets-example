const http = require('http')
const app = require('express')()
const redis = require('socket.io-redis')

const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer, {
  transports: ['websocket']
})
const APP_ID = process.env.APP_ID

io.adapter(redis({ host: process.env.REDIS_HOST, port: 6379 }))

io.on('connection', (socket) => {

  console.log(`new connection was made server ${APP_ID}`)

  socket.join('chat', () => console.log(`Server ${APP_ID} join successfully to chat room!`))
  socket.on('chat', (message) => {
    console.log(`server ${APP_ID} received a message`)
    io.to('chat').emit('chat-message', `${APP_ID}: ${message}`)
  })

  socket.once('disconnect', () => {
    console.log(`user on ${APP_ID} disconnected.`)
  })
})

app.get('/', (_, res) => {
  res.send(`
    <html>
      <body>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
      <script>
        const ws = io('http://localhost:8080', { transports: ['websocket'] })
        ws.on('connect', () => console.log('ws connected'))
        ws.on('chat-message', message => console.log(message))
      </script>
      </body>
    </html>
  `)
})

httpServer.listen(APP_ID, () => console.log(`${APP_ID} is listening on port: ${APP_ID}`))
