import fs from 'fs';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString())

app.get('/api/v1/tours', (req, res)=>{
    res.status(200 ).json({
        status: 'success',
        results: tours?.length ?? 0,
        data: {tours},
    })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
