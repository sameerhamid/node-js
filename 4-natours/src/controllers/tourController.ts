import Tour from './../models/tourModel';
import { NextFunction } from 'express'
import catchAsync from '../utils/catchAsync';
import { createOne, deletOne, getAll, getOne, updateOne } from './handlerFactory';

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

export { getAllTours, getTour, createTour, updateTour, deletTour, aliasTopTours, getTourStats, getMonthlyPlan };
