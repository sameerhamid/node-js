import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import app from './app';


const PORT = process.env.PORT || 3000;

// console.log(process.env)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
