// const express = require("express");
// const router = express.Router();
// const FilterController = require("../controllers/filter.controller");
//
// // Define the filter route
// router.get("/filter", FilterController.filter);
//
// module.exports = router;

const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/filter.controller"); // Adjust to match the correct file path

// Route for getting movies by genre
router.get('/movies/genre/:genre', (req, res) => {
    const movieController = new MovieController(); // Ensure a new instance of the controller is created
    movieController.getMovies(req, res); // Call the getMovies method
});

module.exports = router;



