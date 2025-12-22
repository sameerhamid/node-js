import mongoose from 'mongoose';

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
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourShema);
export default Tour;
