import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../../src/models/tourModel';
import Review from '../../src/models/reviewModel';
import User from '../../src/models/userModel';

dotenv.config({ path: './config.env' });
const MONOGDB_URL = ""

mongoose.connect(MONOGDB_URL).then(_con => {
    // console.log(con.connections);
    console.log("DB connection successful!");
});


// READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));

// IMPORT DATA INTO DB

const importData = async () => {
    console.log("tours>>>>>>>>>>>", tours);
    console.log("users>>>>>>>>>>>", users);
    console.log("reviews>>>>>>>>>>>", reviews);
    try {
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave: false});
        await Review.create(reviews);
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
        await User.deleteMany();
        await Review.deleteMany();
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
