var express = require('express');
var router = express.Router();

// Require controller modules.
var test_run_controller = require('../controllers/testruncontroller');

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/test/test_run_details/:environment_id', test_run_controller.testrun_details_create_get);

// POST request for creating BookInstance.
router.post('/test/test_run_details', test_run_controller.testrun_details_create_post);

module.exports = router;
