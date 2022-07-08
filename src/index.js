require('dotenv').config()
const DURATION = 30000
const Web3 = require('web3')
const express = require('express')
var cors = require('cors')
const socketIo = require(`socket.io`)
const http = require(`http`)
var multer = require('multer')

const app = express()
app.use(express.json())
app.use(cors())
var upload = multer()
app.use(upload.array())
app.use(express.static('public'))

const auth = require('./auth')
// app.use(auth);

const makeData = require('./utils/findEx')
const markets = require('./utils/markets')
const filterCoins = require('./utils/filterCoins')

const server = http.createServer(app)

// SOCKET --------------------
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
    io
      .to(`intra_arb_bot`)
      .emit(`markets`, JSON.stringify(filterCoins(markets(data)))),
  )
}, DURATION)

app.get('/', async function (req, res) {
  res.send('welcome')
})
app.use('/entry', require('./routes/entry'))
app.use('/crypto', require('./routes/crypto'))

// for killing port on restart and exit
process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2')
})

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT')
})

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err)
})

// for local
// app.listen(process.env.PORT || 3536,'localhost',()=>{
//     console.log("Server is listening on port 3536");
// });

const PORT = process.env.PORT || 4000
// app.listen(PORT, '0.0.0.0', () => {
//     console.log("Server is listening on ", PORT);
// });

server.listen(PORT, '0.0.0.0', (err) => {
  if (err) console.log(err)
  console.log(`Server running on Port `, PORT)
})
