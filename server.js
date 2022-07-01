
require('dotenv').config()

const markets = require('./markets')

const DURATION = 30000

const express = require(`express`)
const socketIo = require(`socket.io`)
const http = require(`http`)
const PORT = process.env.PORT || 4000
const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    // origin: 'http://localhost:3000',
    origin: process.env.ORIGIN,
  },
}) //in case server and client run on different urls

io.on(`connection`, (socket) => {
  console.log(`client connected: `, socket.id)

  socket.join(`intra_arb_bot`)

  socket.on(`disconnect`, (reason) => {
    console.log(reason)
  })
})


setInterval(async () => {
  // io.to(`intra_arb_bot`).emit(`markets`, new Date())
  

  await makeData((data) => 
  io.to(`intra_arb_bot`).emit(`markets`, JSON.stringify(markets(data))))
}, DURATION)





server.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log(`Server running on Port `, PORT)
})

// await makeData((data) => connection.write(JSON.stringify(markets(data))))
