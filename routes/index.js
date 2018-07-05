var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');
var test_run_controller = require('../controllers/testruncontroller');

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

module.exports = router;
