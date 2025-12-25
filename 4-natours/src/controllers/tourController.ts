import { Query } from 'mongoose';
import Tour from './../models/tourModel';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];


const getAllTours = async (req: any, res: any) => {
	try {
		//---------------- BUILD THE QUERY
		// 1A) FILTERING
		const queryObj = {...req.query};
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(el => delete queryObj[el]);

		// 1B) ADVANCED FILTERING
		let queryString = JSON.stringify(queryObj);
		queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
		const parsedQuery = JSON.parse(queryString);

		// CONVERT VALUE TO NUMBER
		Object.keys(parsedQuery).forEach((key) => {
			const value = parsedQuery[key];

			if (typeof value === 'object' && value !== null) {
				Object.keys(value).forEach((op) => {
					const opValue = (value as Record<string, unknown>)[op];

					if (typeof opValue === 'string' && !isNaN(Number(opValue))) {
						(value as Record<string, number>)[op] = Number(opValue);
					}
				});
			}
		});

		let query:Query<any, any> = Tour.find(parsedQuery)
		// 2) ------------------ SORTING
		if (req.query.sort) {
			const sortBy = (req.query.sort as string).split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		// 4) FIELD LIMITING
		if(req.query.fields){
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		}
		query = query.select('-__v');
		//---------------- EXICUTE THE QUERY
		const tours = await query;

		 // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
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

export { getAllTours, getTour, createTour, updateTour, deletTour }
