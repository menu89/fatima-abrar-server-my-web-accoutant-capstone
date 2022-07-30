const express = require ('express');
const server = express();
const cors = require('cors');

const generalRoutes = require('./routes/generalRoutes');
const userRoutes = require('./routes/userRoutes');
const bankRoutes = require('./routes/bankReoutes');
const transactionRoutes = require('./routes/transactionsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const transferRoutes = require('./routes/transferRoutes');
const cashflowRoutes = require('./routes/cashflowRoutes');

const testArea = require('./test.js');


//middleware
require('dotenv').config();
const PORT = process.env.PORT || 8000;

server.use(cors())
server.use(express.json())


//routes
server.get('/', (req,res) => {res.send(<h1>Welcome to the web accountant server site.</h1>)})
server.use('/api', generalRoutes);
server.use('/api/user', userRoutes);
server.use('/api/banks', bankRoutes)
server.use('/api/actual', transactionRoutes);
server.use('/api/budget', budgetRoutes)
server.use('/api/transfer', transferRoutes);
server.use('/api/cashflow', cashflowRoutes);

server.use('/api/test', testArea)

//initialize server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})