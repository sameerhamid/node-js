import mongoose, { Query } from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema({
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
    secretTour: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
})

// 1) DOCUMENT MIDDLEWARE - Runs before .save() and .create()
tourSchema.pre('save', function(){
    this.slug = slugify(this.name, {lower: true});
});

tourSchema.pre('save', function(){
    // console.log(this);
});

tourSchema.post('save', function(doc, next){
    // console.log(doc);
    next();
})


// 2. QUERY MIDELEWAR -

interface QueryWithStart<T> extends Query<any, T> {
  start?: number;
}
tourSchema.pre<QueryWithStart<any>>(/^find/, function () {
  this.start = Date.now();                 // ✅ now allowed
  this.find({ secretTour: { $ne: true } }); // ✅ now typed
});

// tourSchema.pre('findOne', function(){
//     this.find({ secretTour: { $ne: true}});
// })

tourSchema.post<QueryWithStart<any>>(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start!} milliseconds`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
