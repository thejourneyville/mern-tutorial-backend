// require the dotenv module and direcly invoke .config method
// this will enable to pull .env values using process.env.something
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const workoutRoutes = require("./routes/workouts");

// express app invocation
const app = express();

// middleware

// used to add request to req body
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    // need next() to pass express to the next middleware
    next();
});

// TEST
// routes
// app.get('/', (req, res) => {
//     res.json({mssg: "Welcome to the app"})
// })

// adding routes from routes/workouts to middleware:
// when user fires /api/workouts it will use the routes
// in 'workoutRoutes'
app.use("/api/workouts", workoutRoutes);

// connect to db
mongoose
    // connect authorization from ENV
    .connect(process.env.MONG_URI)
    // it's asyncrhonous so it returns a promise... using .then
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`connected to DB and listening on port ${process.env.PORT}`);
        });
    })
    // log the error if something doesn't connect to db correctly
    .catch((error) => {
        console.log(error);
    });
