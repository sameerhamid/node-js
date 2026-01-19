import mongoose, { Model, Query, Types } from "mongoose";
import Tour from "./tourModel";

/** Review document */
interface IReview {
  review: string;
  rating: number;
  tour: Types.ObjectId;
  user: Types.ObjectId;
}

/** Review model (statics go here) */
interface ReviewModel extends Model<IReview> {
  calAverageRatings(tourId: Types.ObjectId): Promise<void>;
}

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, 'A review must have more or equal than 2 chars'],
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

reviewSchema.pre(/^find/, function (this: Query<any, any>) {
    this/*.populate({
        path: 'tour',
        select: 'name'
    })*/.populate({
        path: 'user',
        select: 'name photo'
    })
});

reviewSchema.statics.calAverageRatings = async function (tourId: string) {
    const statts = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: statts[0].avgRating,
        ratingsQuanitity: statts[0].nRatings,
    })
}

reviewSchema.post('save', function(){
    // this points to current review
    const ReviewModel = this.constructor as ReviewModel;
    ReviewModel.calAverageRatings(this.tour);
})

const Review = mongoose.model<IReview, ReviewModel>('Review', reviewSchema);

export default Review;
