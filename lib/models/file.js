'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        Hashids = require('hashids');
var hashids = new Hashids("this is my pepper");

var FileSchema = new Schema({
  name: String,
  size: Number,
  user_id: {},
  tags: [],
  hash: {type: String},
  status: {type: String, enum: ['public', 'private', 'removed'], default: 'public'}
});

FileSchema.virtual('published').get(function() {
  return new Date(parseInt(this._id.toString().slice(0, 8), 16) * 1000);
});

FileSchema.pre('save', function(next) {
  this.hash = hashids.encryptHex(this._id);
  next();
});
module.exports = mongoose.model('File', FileSchema);
