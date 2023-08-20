const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')

const { Server } = require('socket.io')

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'https://cushyrental-chat-fe02ec9a5b8b.herokuapp.com',
        ],
    },
})

const sockets = require('./socket/sockets')
const roomsRoute = require('./routes/room-routes')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8qo87aw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(uri)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.use('/', roomsRoute)

io.on('connection', sockets)

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})
