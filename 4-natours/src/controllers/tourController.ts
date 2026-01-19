import Tour from './../models/tourModel';
import { NextFunction } from 'express'
import catchAsync from '../utils/catchAsync';
import { createOne, deletOne, getAll, getOne, updateOne } from './handlerFactory';
import { AppError } from '../utils/appError';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];

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

export { getAllTours, getTour, createTour, updateTour, deletTour, aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin };
