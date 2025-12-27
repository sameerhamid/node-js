import mongoose from 'mongoose';
import slugify from 'slugify';

const tourShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    slug: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuanitity: {
        type: Number,
        default: 0
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary'],
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    createdAt: {
        type: Date,
        select: false
    },
    startDates: [Date],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

tourShema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
})

// 1) DOCUMENT MIDDLEWARE - Runs before .save() and .create()
tourShema.pre('save', function(){
    this.slug = slugify(this.name, {lower: true});
});

tourShema.pre('save', function(){
    // console.log(this);
});

tourShema.post('save', function(doc, next){
    // console.log(doc);
    next();
})

const Tour = mongoose.model('Tour', tourShema);
export default Tour;
