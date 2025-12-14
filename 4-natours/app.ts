import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Natours!' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint!');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
