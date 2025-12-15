import fs from 'fs';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString()) as [any]

app.get('/api/v1/tours', (req, res)=>{
    res.status(200 ).json({
        status: 'success',
        results: tours?.length ?? 0,
        data: {tours},
    })
})

app.get('/api/v1/tours/:id', (req, res)=>{
    console.log(req.params.id);
    const tour = tours.find((el: any) => el.id === +req.params.id)
    if(!tour){
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }
    res.status(200 ).json({
        status: 'success',
        results: tours?.length ?? 0,
        data: {tour },
    })
})

app.post('/api/v1/tours', (req, res)=>{
    console.log(req.body);
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body)
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours),  (err)=>{
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
})

app.patch('/api/v1/tours/:id', (req, res)=>{
    const tour = tours.find((el: any) => el.id === +req.params.id)
    if(!tour){
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
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
