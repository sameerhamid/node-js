import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
import app from './app';


const PORT = process.env.PORT || 3000;
const MONOGDB_URL = process.env.MONOGDB_URL ?? "";

mongoose.connect(MONOGDB_URL).then(_con => {
    // console.log(con.connections);
    console.log("DB connection successful!");
});

// console.log(process.env)

const tourShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    rating: {
        type: Number,
        default: 4.5,
    }
})

const Tour = mongoose.model('Tour', tourShema);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
