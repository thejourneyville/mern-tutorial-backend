const mongoose = require('mongoose');

const Schema = mongoose.Schema

// schema defines the structure of the document for the db
const workoutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        requird: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)
