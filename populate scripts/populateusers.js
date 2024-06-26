const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

const DB_USER = "testuser123321";
const DB_PASS = "5DtfQaMEaF0vb9Vn";

const dev_db_url = "mongodb+srv://" + DB_USER + ":" + DB_PASS + "@databaseNumber1.bxvhltu.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseNumber1";


async function dbConnection() {
    try {
        await mongoose.connect(dev_db_url);
        console.log("Connected to the database");
    } catch (error) {
        console.log("Could not connect to the database", error);
    }
}
dbConnection();

async function userCreate(firstName, lastName, email, password, role, department, preferences, vacationDays, permission, timeStamp) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userdetail = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        department,
        preferences,
        vacationDays,
        permission,
        timeStamp
    };

    const user = new User(userdetail);
    await user.save();
    console.log(`added user ${firstName} ${lastName}`);
} 

async function createUsers() {
    console.log('Adding users');
    await userCreate('John', 'Doe', 'john.doe@example.com', 'password1', 'Nurse', 'Cardiology', [], [], 0, false);
    await userCreate('Jane', 'Doe', 'jane.doe@example.com', 'password2', 'Nurse', 'Cardiology', [], [], 0, false);
    await userCreate('Jim', 'Doe', 'jim.doe@example.com', 'password3', 'Nurse', 'Cardiology', [], [], 0, false);
    await userCreate('Alice', 'Smith', 'alice.smith@example.com', 'password4', 'Nurse', 'Cardiology', [], [], 0, false);
    await userCreate('Bob', 'Johnson', 'bob.johnson@example.com', 'password5', 'Nurse', 'Cardiology', [], [], 1, false);
    await userCreate('Charlie', 'Williams', 'charlie.williams@example.com', 'password6', 'Nurse', 'Cardiology', [], [], 2, false);
    await userCreate('Diana', 'Brown', 'diana.brown@example.com', 'password7', 'Nurse', 'Cardiology', [], [], 1, false);
    await userCreate('Ethan', 'Jones', 'ethan.jones@example.com', 'password8', 'Nurse', 'Cardiology', [], [], 0, false);
    await userCreate('Fiona', 'Miller', 'fiona.miller@example.com', 'password9', 'Nurse', 'Cardiology', [], [], 0, false);
    await userCreate('thisIs', 'AName', 'user@user.com', 'user', 'Nurse', 'Cardiology', [], [], 2, false);
    console.log('Users added');
}

createUsers().catch(console.error);