var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    title: {type: String, require: true},
    author: {type: Schema.ObjectId, ref: 'Author', require: true },
    summary: {type: String, require: true },
    isbn : {type:String, require: true },
    genre: [{type: Schema.ObjectId, ref:'genre'}]
}
);


BookSchema
.virtual('url')
.get(function(){
  return '/catalog/book/'+ this._id;
})


module.exports = mongoose.model('Book',BookSchema)
