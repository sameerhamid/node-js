import mongoose, { Query } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator'

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 chars'],
        minlength: [10, 'A tour name must have more  or equal than 3 chars'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters'],
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
        required: [true, 'A tour must have a difficulty'],
        enum: { values: ["easy", "medium", "difficult"], message: 'Difficulty is either: easy, medium, difficult' }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be bellow 5.0']
    },
    ratingsQuanitity: {
        type: Number,
        default: 0
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val: number) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Price Discount ({VALUE}) should be below regular price',
        }
    },
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
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

// 1) DOCUMENT MIDDLEWARE - Runs before .save() and .create()
tourSchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre('save', function () {
    // console.log(this);
});

tourSchema.post('save', function (doc, next) {
    // console.log(doc);
    next();
})


// 2. QUERY MIDELEWAR -

interface QueryWithStart<T> extends Query<any, T> {
    start?: number;
}

// tourSchema.pre('findOne', function(){
//     this.find({ secretTour: { $ne: true}});
// })

tourSchema.post<QueryWithStart<any>>(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start!} milliseconds`);
    next();
});

//3. AGGRIGATION MIDDLEWAR --------

tourSchema.pre('aggregate', function () {
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true } }
    })
})

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
