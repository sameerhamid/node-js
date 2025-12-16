import fs from 'fs';
import {tours} from '../../dev-data';

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];

const getAllTours = (req: any, res: any) => {
    console.log(req.requestTime);
    // console.log(req.connection);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours?.length ?? 0,
        data: { tours },
    })
}

const getTour = (req: any, res: any) => {
    console.log(req.params.id);
    const tour = tours.find((el: any) => el.id === +req.params.id)
    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }
    res.status(200).json({
        status: 'success',
        results: tours?.length ?? 0,
        data: { tour },
    })
}

const createTour = (req: any, res: any) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
}

const updateTour = (req: any, res: any) => {
    const tour = tours.find((el: any) => el.id === +req.params.id)
    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tours: '<Tour Update Successfull!>'
        }
    })
}

const deletTour = (req: any, res: any) => {
    const tour = tours.find((el: any) => el.id === +req.params.id)
    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
}

export {getAllTours, getTour, createTour, updateTour, deletTour}
