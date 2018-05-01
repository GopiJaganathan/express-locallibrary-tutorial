var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var moment = require('moment');

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
  }
);

AuthorSchema
.virtual('name')
.get(function(){
  return this.family_name + ', ' + this.first_name;
});

AuthorSchema
.virtual('url')
.get(function(){
  return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('lifespan')

.get(function(){
  if (this.date_of_death)
  {
    this.date_of_death = Date.now()
  }
  dod = moment(this.date_of_death)
  dob = moment(this.date_of_birth)
  return dod.diff(dob,'years')
})

module.exports = mongoose.model('Author', AuthorSchema)
