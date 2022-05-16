const express = require ('express');
const server = express();
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 8000;

server.use(cors())
server.use(express.json())
server.use(express.static('public'))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})