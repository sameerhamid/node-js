import Tour from './../models/tourModel';
import { NextFunction } from 'express';
import APIFreatures from '../utils/apiFeatures';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];

const aliasTopTours = async (req: any, res: any, next: NextFunction) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
}

const getAllTours = async (req: any, res: any) => {
	try {
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
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error
		})
	}
}

const getTour = async (req: any, res: any) => {
	try {
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			data: { tour },
		})
	} catch (error) {
		res.status(400).json({
			status: 'fail ',
			message: error,
		})
	}
}

const createTour = async (req: any, res: any) => {
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail ',
			message: error,
		})
	}
}

const updateTour = async (req: any, res: any) => {
	try {
		const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail ',
			message: error,
		})
	}
}

const deletTour = async (req: any, res: any) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success',
			data: null,
		})
	} catch (error) {
		res.status(400).json({
			status: 'fail ',
			message: error,
		})
	}
}

const getTourStats = async (req: any, res: any) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5 } }
			},
			{
				$group: {
					// _id: '$ratingsAverage',
					_id: { $toUpper : '$difficulty'},
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
	} catch (error) {
		res.status(400).json({
			status: 'fail ',
			message: error,
		})
	}
}

export { getAllTours, getTour, createTour, updateTour, deletTour, aliasTopTours, getTourStats }
