const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')

const { Server } = require('socket.io')

const app = express()

app.use(bodyParser.json())

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
const notificationRoute = require('./routes/notification-routes')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cushyrental.xuzxbkh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
// mongoose.connect(uri)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', sockets)
app.use('/', roomsRoute)
app.use('/', notificationRoute)

const PORT = process.env.PORT || 4000

mongoose
    .connect(uri)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })
