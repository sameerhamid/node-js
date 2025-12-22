import fs from 'fs';
import { NextFunction } from 'express';
import Tour from './../models/tourModel';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];


const getAllTours = async (req: any, res: any) => {
	try {
		const tours = await Tour.find();
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
	console.log(req.body);
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

const updateTour = (req: any, res: any) => {
	// const tour = tours.find((el: any) => el.id === +req.params.id)
	// if (!tour) {
	//     return res.status(404).json({
	//         status: 'failed',
	//         message: 'Invalid ID',
	//     })
	// }
	res.status(200).json({
		status: 'success',
		data: {
			tours: '<Tour Update Successfull!>'
		}
	})
}

const deletTour = (req: any, res: any) => {
	// const tour = tours.find((el: any) => el.id === +req.params.id)
	// if (!tour) {
	//     return res.status(404).json({
	//         status: 'failed',
	//         message: 'Invalid ID',
	//     })
	// }
	res.status(204).json({
		status: 'success',
		data: null
	})
}

export { getAllTours, getTour, createTour, updateTour, deletTour }
