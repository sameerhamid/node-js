import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../../src/models/tourModel';

dotenv.config({ path: './config.env' });
const MONOGDB_URL = ""

mongoose.connect(MONOGDB_URL).then(_con => {
    // console.log(con.connections);
    console.log("DB connection successful!");
});


// READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));

// IMPORT DATA INTO DB

const importData = async () => {
    console.log(tours)
    try {
        await Tour.create(tours)
        console.log("Data successfully loaded!");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

//DELETE ALL DATA FROM DB

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Data Successfully deleted!");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
console.log(process.argv);
