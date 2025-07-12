// Config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        process.exit(1); // Sai do processo com falha
    }
}