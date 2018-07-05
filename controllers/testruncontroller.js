const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var TestCaseDetails = require('../models/testcase');
var TestRunDetails = require('../models/testrun');
var async = require('async');
var asyncWaterFall = require('async-waterfall');
//var asyncforEach = require('async-foreach').forEach;

exports.testrun_details_create_post = [

    body('run_id', 'run_id must be specified').isLength({ min: 1 }).trim(),
    body('job_url', 'job_url must be specified').isLength({ min: 1 }).trim(),
    body('environment').isLength({ min: 1 }).trim().withMessage('environment must be specified'),

    // Sanitize fields.
    sanitizeBody('run_id').trim().escape(),
    sanitizeBody('job_url').trim().escape(),
    sanitizeBody('run_date').toDate(),
    sanitizeBody('run_purpose').trim().escape(),
    sanitizeBody('environment').trim().escape(),
    sanitizeBody('run_duration').trim().escape(),
    sanitizeBody('testcase_details').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        var testrundetails = new TestRunDetails(
          {
            run_id: req.body.run_id,
            job_url: req.body.job_url,
            run_date: req.body.run_date,
            run_purpose: req.body.run_purpose,
            environment: req.body.environment,
            test_case_detail: req.body.testcase_details
           });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            TestRunDetails.find({},'title')
                .exec(function (err, testrundetails) {
                    if (err) { return next(err); }
                    res.status(400).send(JSON.stringify({ title: 'Create Testrundetails', run_details: testrundetails, errors: errors.array()}));
            });
            return;
        }
        else {
            testrundetails.save().then((err, test_run_detail_res)=>
            {
              if (err) { return res.send(err); }
              res.status(200).send(JSON.stringify({ run_details: test_run_detail_res}));
              });
          }
        }
];


exports.testrun_details_create_get = function(req, res, next) {
  console.log("inside error1 "+req.params.environment_id)
  TestRunDetails
  .find({environment: req.params.environment_id})
  .sort({ run_date : -1 })
  .exec(function (err, testrundetails) {
    if (err) { console.log("inside error1"+err);return next(err); }
    res.send( JSON.stringify({ case_list: testrundetails }));
    });
};

exports.testcase_details_create_get = function(req, res, next) {
  var filter = {};

  if(req.query.run_id)
      filter.run_id = req.query.run_id;
  if(req.query.run_id)
      filter.run_id = req.query.run_id;

  TestRunDetails.find(filter)
    .sort([['run_date', 'descending']])
    .exec(function (err, list_runs) {
      if (err) { return next(err); }
      //Successful, so render
      res.send( { title: 'run details List', run_list: list_runs });
    });


    async.parallel({
        author: function(callback) {
          if(req.query.environment_id){
              filter.environment_id = req.query.environment_id;
              Author.findById(req.params.id)
              .exec(callback);
            }
        },
        author_books: function(callback) {
          Book.find({ author: req.params.id }, 'title summary')
          .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('author_detail', { title: 'Title', author:  results.author,  author_books: results.author_books } );
    });
};
