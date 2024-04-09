const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const User = require('../models/user');



const dev_db_url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@databaseNumber1.bxvhltu.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseNumber1";

async function dbConnection() {
    try {
        await mongoose.connect(dev_db_url);
        console.log("Connected to the database");
    } catch (error) {
        console.log("Could not connect to the database", error);
    }
}
dbConnection();

async function userCreate(firstName, lastName, email, password, role, department, preferences, permission) {
    const userdetail = {
        firstName,
        lastName,
        email,
        password,
        role,
        department,
        preferences,
        permission
    };

    const user = new User(userdetail);
    await user.save();
    console.log(`added user ${firstName} ${lastName}`);
} 

async function createUsers() {
    console.log('Adding users');
    await userCreate('John', 'Doe', 'john.doe@example.com', 'password1', 'Nurse', 'Cardiology', [], 0);
    await userCreate('Jane', 'Doe', 'jane.doe@example.com', 'password2', 'Nurse', 'Cardiology', [], 0);
    await userCreate('Jim', 'Doe', 'jim.doe@example.com', 'password3', 'Nurse', 'Cardiology', [], 0);
    await userCreate('Alice', 'Smith', 'alice.smith@example.com', 'password4', 'Nurse', 'Cardiology', [], 0);
    await userCreate('Bob', 'Johnson', 'bob.johnson@example.com', 'password5', 'Nurse', 'Cardiology', [], 1);
    await userCreate('Charlie', 'Williams', 'charlie.williams@example.com', 'password6', 'Nurse', 'Cardiology', [], 2);
    await userCreate('Diana', 'Brown', 'diana.brown@example.com', 'password7', 'Nurse', 'Cardiology', [], 1);
    await userCreate('Ethan', 'Jones', 'ethan.jones@example.com', 'password8', 'Nurse', 'Cardiology', [], 0);
    await userCreate('Fiona', 'Miller', 'fiona.miller@example.com', 'password9', 'Nurse', 'Cardiology', [], 0);
    await userCreate('thisIs', 'AName', 'user@user.com', 'user', 'Nurse', 'Cardiology', [], 2);
    console.log('Users added');
}

createUsers().catch(console.error);