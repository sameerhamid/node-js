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

const updateTour = async (req: any, res: any) => {
	try {
		const newTour = await Tour.findByIdAndUpdate(req.body, { new: true });
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
