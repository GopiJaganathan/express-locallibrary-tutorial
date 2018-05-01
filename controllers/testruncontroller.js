const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var TestCaseDetails = require('../models/testcase');
var TestRunDetails = require('../models/testrun');
var async = require('async');
//var asyncforEach = require('async-foreach').forEach;

// Handle BookInstance create on POST.
exports.testrun_details_create_post = [

    // Validate fields.
    body('run_id', 'run_id must be specified').isLength({ min: 1 }).trim(),
    body('job_url', 'job_url must be specified').isLength({ min: 1 }).trim(),
    body('environment').isLength({ min: 1 }).trim().withMessage('environment must be specified'),
    //body('run_duration').isLength({ min: 1 }).trim().withMessage('environment must be specified'),

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

        // run_id: {type: String, require: true},
        // job_url: {type: String, require: true },
        // run_date: {type: String, require: true },
        // run_purpose : {type:String, require: true },
        // environment : {type:String, require: true },
        // run_instance: [{type : Schema.ObjectId, ref: 'TestCaseDetails', required: true }]
        // Create a BookInstance object with escaped and trimmed data.
        var testrundetails = new TestRunDetails(
          { run_id: req.body.run_id,
            job_url: req.body.job_url,
            run_date: req.body.run_date,
            run_purpose: req.body.run_purpose,
            environment: req.body.environment
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

            //Data to save test case details
            req.body.testrun_details = req.body.testrun_details.map(function(testcase) {
              testcase.run_id = req.body.run_id;
              return testcase;
            })

            //Data to save test run details
            testrundetails.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.status(200).send(JSON.stringify({ title: 'Successful stored', test_Case_details: TestCaseDetails.insertMany(req.body.testrun_details),obje_id : testrundetails.url, test_details : testrundetails}));
            });

            // //Data to save test run details
            // testrundetails.save(function (err) {
            //     if (err) { return next(err); }
            //        // Successful - redirect to new record.
            //        res.status(200).send(JSON.stringify({ title: 'Successful stored', test_Case_details: TestCaseDetails.insertMany(req.body.testrun_details),obje_id : testrundetails.url, test_details : testrundetails}));
            // });

            // // Data from form is valid.
            // TestCaseDetails.insertMany(req.body.testrun_details).then(function(err) {
            //   // res.status(200).send(JSON.stringify({ title: 'Inserting test case details', obje_id : testcasedetails.url, test_case_details: testcase_details}));
            //   // Data from form is valid.
            //  })
            // .catch(function(err) {
            //   res.status(400).send(JSON.stringify({ title: 'unable to stored', obje_id : testcasedetails.url, error_message: err})); });
           }

        }
];

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {
  async.parallel({
      author: function(callback) {
          Author.findById(req.params.id)
            .exec(callback);
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
      // Successful, so render.
      res.render('author_detail', { title: 'Title', author:  results.author,  author_books: results.author_books } );
  });
};


// // Display BookInstance create form on GET.
// exports.testrun_details_create_get = function(req, res, next) {
//
//     TestRunDetails.find({environment: req.params.environment_id},'title')
//     .populate()
//     .exec(function (err, test_detail_env) {
//        if (err) { return next(err); }
//        async.parallel({
//             author : function(callback) {
//               console.log(" --> "+test_detail_env);
//               test_detail_env.forEach(function(test_detail_id, index, arr) {
//               console.log(test_detail_id);
//               TestRunDetails.findById(test_detail_id)
//          });
//          exec(callback);
//          }
//        }, function(err, results) {
//              if (err) { return next(err); }
//
//       // Successful, so render.
//       res.send({title: 'environet wise information', test_detail:results.test_detail_env, environment: req.params.environment_id});
//     });
//     });
// };


exports.testrun_details_create_get = function(req, res, next) {
  var filter = {};
if(req.query.environment_id)
    filter.environment_id = req.query.environment_id;
if(req.query.run_id)
    filter.run_id = req.query.run_id;
if(req.query.run_id)
        filter.run_id = req.query.run_id;

// you cannot know if the incoming
// price is for gt or lt, so

// add new query variable price_gt (price greater than)
if(req.query.price_gt) {
    filter.price = filter.price || {};
    filter.price.$gt = req.query.price_gt;
}

  TestRunDetails.find(filter)
    .sort([['run_date', 'descending']])
    .exec(function (err, list_runs) {
      if (err) { return next(err); }
      //Successful, so render
      res.send( { title: 'run details List', run_list: list_runs });
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};
