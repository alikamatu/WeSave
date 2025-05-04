const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const savingsRoutes = require('./routes/savings');
// const groupRoutes = require('./routes/group');
const transactionRoutes = require('./routes/transaction');
// const chatRoutes = require('./routes/chat');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/transactions', transactionRoutes);
// app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));