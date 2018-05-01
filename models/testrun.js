var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var TestRunDetailsSchema = new Schema(
  {
    run_id: {type: String, require: true},
    job_url: {type: String, require: true },
    run_date: {type: String, require: true },
    run_purpose : {type:String, require: true },
    environment : {type:String, require: true },
}
);

TestRunDetailsSchema
.virtual('url')
.get(function(){
  return ''+this._id;
});


module.exports = mongoose.model('TestRunDetails',TestRunDetailsSchema)
