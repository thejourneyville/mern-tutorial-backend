const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// get all workouts
const getWorkouts = async (req, res) => {
    // this will find all workout documents in the collection in decending order
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    // returns success status and the list of workouts
    // in json to the client/browser
    res.status(200).json(workouts);
};

// get a single workout (asynchronous)
const getWorkout = async (req, res) => {
    // grab the ID from the request parameters (ex: from URL /path/idnumber)
    const { id } = req.params;

    // moongoose library .Types.ObjectId.isValid(id) will check id validity and
    // return boolean. If id is not valid, return 404 in the response with json
    // error object
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" });
    }

    // the Workout model has a method to find by an id, bind to 'workout'
    const workout = await Workout.findById(id);
    // if workout is null, return error message as json with object
    if (!workout) {
        return res.status(404).json({ error: "No such workout" });
    }
    // if no error, send 200 status with workout in json
    res.status(200).json(workout);
};

// create a new workout
const createWorkout = async (req, res) => {
    // object sent from frontend in the request body
    // destructured
    const { title, load, reps } = req.body;

    // creating empty array to hold any blank fields
    let emptyFields = [];

    if (!title) {
        emptyFields.push(" title");
    }
    if (!load) {
        emptyFields.push(" load");
    }
    if (!reps) {
        emptyFields.push(" reps");
    }

    // if any blank fields, respond with status 400 and error message
    // along with the emptyFields array in json
    if (emptyFields.length > 0) {
        return res
            .status(400)
            .json({ error: `Please fill in all fields: ${emptyFields}`, emptyFields });
    }

    // let's try to create mongoDB document
    // with those destructured properties
    // it will also return the document just created, along with
    // the ID of that document, which is binded to 'workout'
    try {
        const workout = await Workout.create({ title, load, reps });
        // if this works respond with 200 with workout
        // document in json format
        res.status(200).json(workout);
        // otherwise catch the error, (400) and return json error message
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a workout
const deleteWorkout = async (req, res) => {
    // grab the ID from the request parameters (ex: from URL /path/idnumber)
    const { id } = req.params;

    // moongoose library .Types.ObjectId.isValid(id) will check id validity and
    // return boolean. If id is not valid, throw 404 in the response with json
    // error object
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" });
    }
    // findOneAndDelete method will filter the id param in the model
    // and delete the corresponding document, it will copy this
    // deleted entry to 'workout' for logging confirmation
    const workout = await Workout.findOneAndDelete({ _id: id });

    // if workout is null (ex: cannot find id) will return errror
    // json to client
    if (!workout) {
        return res.status(400).json({ error: "No such workout" });
    }
    // otherwise send confirmation of deleted workout with copy
    res.status(200).json(workout);
};

// update a workout
const updateWorkout = async (req, res) => {
    // grab the ID from the request parameters (ex: from URL /path/idnumber)
    const { id } = req.params;
    // moongoose library .Types.ObjectId.isValid(id) will check id validity and
    // return boolean. If id is not valid, return 404 in the response with json
    // error object
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such workout" });
    }
    // object sent from frontend in the request body
    // destructured
    const { title, load, reps } = req.body;
    // the Workout model has a method to find and update by an id,
    // bind to 'updatedWorkout'
    const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: id },
        { ...req.body }
    );
    // if updatedWorkout is null, return error message as json with object
    if (!updatedWorkout) {
        return res.status(404).json({ error: "No such workout" });
    }
    // otherwise send confirmation of deleted workout with copy
    res.status(200).json(`workout updated: ${updatedWorkout}`);
};

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout,
};
