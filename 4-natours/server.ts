import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
import app from './app';
import mqttClient from './src/mqtt';

const PORT = process.env.PORT || 3000;
const MONOGDB_URL = process.env.MONOGDB_URL ?? "";

// for import
mqttClient;

process.on('uncaughtException', ((err: any) => {
    console.log("UNCAUGTH EXCEPTION! 🔥 SHUTTING DOWN...")
    console.log(err.name, err.message);
    process.exit(1);
}));


mongoose.connect(MONOGDB_URL).then(_con => {
    // console.log(con.connections);
    console.log("DB connection successful!");
});

// console.log(process.env)

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


process.on('unhandledRejection', ((err: any) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION 🔥 SHUTTING DOWN...")
    server.close(() => {
        process.exit(1);
    })
}));
