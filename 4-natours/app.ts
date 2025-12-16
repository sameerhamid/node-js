import fs from 'fs';
import express from 'express';
import morgan from 'morgan'

const app = express();
const PORT = 3000;

// 1) -------------- MIDDLEWARES ----------
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log("Hello from the middleware");
    next();
})

app.use((req: any, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any];
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`).toString()) as [any];


// 2) -------------- ROUTE HANDLERS ----------
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

const getAllUsers = (req: any, res: any) => {
    // res.status(200).json({
    //     status: 'success',
    //     results: users.length ?? 0,
    //     data: {
    //         users
    //     }
    // })

    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const createUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const getUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const updateUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}


// 3) -------------- ROUTES ----------

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deletTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deletTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);



// 4) -------------- START SERVER ----------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
