import mongoose, { Model } from "mongoose";

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'A review must have more or equal than 3 chars'],
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be bellow 5.0'],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
