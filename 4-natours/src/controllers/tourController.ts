import Tour from './../models/tourModel';
import { NextFunction } from 'express'
import APIFreatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];

const aliasTopTours = async (req: any, res: any, next: NextFunction) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
}


const getAllTours = catchAsync(async (req: any, res: any,) => {
	//---------------- EXICUTE THE QUERY
	const features = new APIFreatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
	const tours = await features.query;

	// --------------- SEND RESPONSE
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: tours?.length ?? 0,
		data: { tours },
	})
});

const getTour = catchAsync(async (req: any, res: any, next: NextFunction) => {
	const tour = await Tour.findById(req.params.id).populate('reviews');
	if(!tour){
		return next(new AppError('No tour found with that ID', 404));
	};
	res.status(200).json({
		status: 'success',
		data: { tour },
	})
});

const createTour = catchAsync(async (req: any, res: any) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			tour: newTour
		}
	});
});

const updateTour = catchAsync(async (req: any, res: any, next: NextFunction) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
	if(!tour){
		return next(new AppError('No tour found with that ID', 404));
	};
	res.status(201).json({
		status: 'success',
		data: { tour }
	});
});

const deletTour = catchAsync(async (req: any, res: any, next: NextFunction) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	if(!tour){
		return next(new AppError('No tour found with that ID', 404));
	};
	res.status(204).json({
		status: 'success',
		data: null,
	})
});

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
