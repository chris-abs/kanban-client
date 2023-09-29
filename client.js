const io = require('socket.io-client')

const socket = io('http://localhost:4000')

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})

socket.on('connect_error', (error) => {
  console.error('Connection error:', error)
})
