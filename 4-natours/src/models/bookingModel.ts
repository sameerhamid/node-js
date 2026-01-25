import mongoose, { Query } from "mongoose";

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user.']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price']
    },
    paid: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


bookingSchema.pre<Query<any, any>>(/^find/, function () {
    this.populate('user').populate({
        path: 'tour',
        select: 'name',
    });
});


const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
