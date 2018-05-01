var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var TestCaseDetailsSchema = new Schema(
  {
    case_id: {type: String, require: true},
    status_id: {type: String, require: true},
    type_id: {type: String, require: true },
    jira_ids : [{type:String, require: true }],
    automation_status: {type: String, require: true},
    feature:  {type:String, require: true },
    owner:  {type:String, require: true },
    run_id:  {type:String, require: true },
    test_run_id: {type: Schema.ObjectId, ref: 'TestRunDetails', require: true },
}
);


TestCaseDetailsSchema
.virtual('url')
.get(function(){
  return ''+this._id;
});
module.exports = mongoose.model('TestCaseDetails',TestCaseDetailsSchema);
