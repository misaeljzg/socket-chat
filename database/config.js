const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS);

        console.log('Database online');
    } catch (error) {
        console.log(error);
        throw new Error('Error initializing DB')
    }
}

module.exports = {
    dbConnection
}