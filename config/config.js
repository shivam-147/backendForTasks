const mongoose = require('mongoose')

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        console.error('MongoDB connection failed:', err.message);
    }
}

module.exports = connection;