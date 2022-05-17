const express = require ('express');
const server = express();
const cors = require('cors');
const userRoutes = require('./routes/routes');


//middleware
require('dotenv').config();
const PORT = process.env.PORT || 8000;

server.use(cors())
server.use(express.json())


//routes
server.use('/api/', userRoutes);


//initialize server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})