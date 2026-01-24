import multer from 'multer';
import sharp from 'sharp';
import Tour from './../models/tourModel';
import { NextFunction } from 'express'
import catchAsync from '../utils/catchAsync';
import { createOne, deletOne, getAll, getOne, updateOne } from './handlerFactory';
import { AppError } from '../utils/appError';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];

const multerStorage = multer.memoryStorage();

const multerFiler = (req: any, file: Express.Multer.File, cb: any) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please upload only images.', 400), false)
	}
}

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFiler
});

const uploadTourImages = upload.fields([
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 3 }
]);

const resizeTourImages = catchAsync(async (req: any, res: any, next: NextFunction) => {
	if (!req?.files?.imageCover || !req?.files?.images) {
		return next();
	}
	// 1) Cover image
	req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333, /*{ fit: 'contain' }*/)
		.toFormat('jpeg').jpeg({ quality: 90 })
		.toFile(`public/img/tours/${req.body.imageCover}`);
	// 2) Images
	req.body.images = [];
	await Promise.all(req?.files?.images?.map(async (file: any, i: number) => {
		const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
		await sharp(file.buffer)
			.resize(2000, 1333, /*{ fit: 'contain' }*/)
			.toFormat('jpeg').jpeg({ quality: 90 })
			.toFile(`public/img/tours/${fileName}`);
		req.body.images.push(fileName);
	}))
	next();
})

const aliasTopTours = async (req: any, res: any, next: NextFunction) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
}


const getAllTours = getAll(Tour);
const getTour = getOne(Tour, { path: 'reviews' });
const createTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deletTour = deletOne(Tour);

const getTourStats = catchAsync(async (req: any, res: any) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } }
		},
		{
			$group: {
				// _id: '$ratingsAverage',
				_id: { $toUpper: '$difficulty' },
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRatings: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				macPrice: { $max: '$price' }
			},
		},
		{
			$sort: { avgPrice: 1 }
		},
		// {
		// 	$match: { _id: { $ne: 'EASY' }}
		// }
	]);
	res.status(200).json({
		status: 'success',
		data: { stats },
	})
});

const getMonthlyPlan = catchAsync(async (req: any, res: any) => {
	const year = +req.params.year;
	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates'
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				}
			}
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numOfTourStarts: { $sum: 1 },
				tours: { $push: '$name' }
			}
		},
		{
			$addFields: { month: '$_id' }
		},
		{
			$project: { _id: 0 }
		},
		{
			$sort: { numOfTourStarts: -1 }
		},
		{
			$limit: 12
		}
	]);
	res.status(200).json({
		status: 'success',
		data: { plan },
	})
});

const getToursWithin = catchAsync(async (req: any, res: any, next: NextFunction) => {
	// tours-within/:distance/center/:latlng/unit/:unit
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');
	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
	console.log(lat, lng)
	if (!lat || !lng) {
		next(new AppError('Please provide latitude and longititue in the format of lat,lng.', 400))
	}
	console.log(distance, latlng, unit);
	const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } })
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			data: tours
		}
	})
})

const getDistances = catchAsync(async (req: any, res: any, next: NextFunction) => {
	const {latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');
	const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
	if (!lat || !lng) {
		next(new AppError('Please provide latitude and longitude in the format of lat,lng.', 400))
	}
	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [+lng, +lat]
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier
			}
		},
		{
			$project: {
				distance: 1,
				name: 1,
			}
		}
	])
	res.status(200).json({
		status: 'success',
		data: {
			data: distances
		}
	})
})

export { getAllTours, getTour, createTour, updateTour, deletTour, aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin, getDistances, uploadTourImages, resizeTourImages };
