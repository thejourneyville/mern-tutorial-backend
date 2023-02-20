const express = require("express");
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout,
} = require("../controllers/workoutController");

// user authentication
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// these routes is added on top of app endpoint

// this middleware runs first to authenticate user and then gives access to other middleware
router.use(requireAuth);

// GET all workouts
router.get("/", getWorkouts);

// GET a single workout
router.get("/:id", getWorkout);

// POST a new workout
// this is an async function
router.post("/", createWorkout);

// DELETE a workout
router.delete("/:id", deleteWorkout);

// UPDATE a workout
router.patch("/:id", updateWorkout);

module.exports = router;
