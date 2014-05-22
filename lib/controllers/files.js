'use strict';

var mongoose = require('mongoose'),
        File = mongoose.model('File'),
        path = require('path'),
        passport = require('passport'),
        _ = require('underscore'),
        fs = require('fs'),
        mime = require('mime'),
        Hashids = require('hashids');
var hashids = new Hashids("this is my pepper");
var saveDir = path.resolve(__dirname, '../../downloads/');

exports.upload = function(req, res) {
  var data = {
    msg: "/files/post"
  };
  data.msg = Object.keys(req.files).length + " files posted";
  Object.keys(req.files).forEach(function(key) {
    var file = req.files[key];
    var newFile = new File(file);
    newFile.user_id = req.user._id;
    newFile.save(function(err, savedFile) {
      if (err)
        return res.json(400, err);
      
      var newFilePath = saveDir + '/' + savedFile._id;
      console.log('filePath', newFilePath, savedFile._id);
      var source = fs.createReadStream(file.path);
      var dest = fs.createWriteStream(newFilePath);

      source.pipe(dest);
      source.on('end', function() { fs.unlink(file.path); res.send(200); });
      source.on('error', function(err) { res.json(400, err); });
    });
  });
};

exports.getFileInfo = function(req, res) {
  var fileIdHash = req.params.fileId;
  var fileId = hashids.decryptHex(fileIdHash);
  File.findById(fileId, function(err, file) {
    if (err) {
      console.log(err);
      res.send(404);
    } else {
      res.json(file);
    }
  });
};

exports.update = function(req, res, next) {
  console.warn('update', req.body);
  console.warn('update2', req.body.file);
  var newFile = req.body.file;
  File.findById(newFile._id, function(err, file) {
    if (!file) {
      res.send(400);
      return;
    }
    file.tags = newFile.tags;
    file.save();
    console.log('===update', file);
  });
  res.send(200);
};

exports.search = function(req, res, next) {
  var search = req.params.searchStr;

  File.find({}, null, {sort: {_id : -1}}, function(err, files) {
    if (err)
      return next(err);
    if (!files)
      return res.send(404);
    return res.json(files);
  });
};

exports.tags_list = function(req, res, next) {
  var result_tags = [];
  File.find({}, {tags: 1}, function(err, files){
    if (err){
      return res.send(404);
    }
    _.forEach(files, function(file){
      result_tags.push(file.tags);
    });
    result_tags = _.chain(result_tags).flatten().sort().uniq(true).value();
    res.json(result_tags);
  });
};

exports.download = function(req, res) {
  var fileIdHash = req.params.fileId;
  var fileId = hashids.decryptHex(fileIdHash);
  if (fileId) {
    File.findById(fileId, function(err, file) {
      if (err || file.status === 'removed') return res.send(404);

      var mimetype = mime.lookup(file.name);

      res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
      res.setHeader('Content-type', mimetype);
      res.setHeader('Content-Length', file.size);
      

      var filestream = fs.createReadStream(saveDir + '/' + file._id);
      filestream.pipe(res);
    });
  } else {
    res.send(404);
  }
  
};

exports.remove = function(req, res) {
  var fileId = req.params.fileId;
  if (fileId) {
    File.findById(fileId, function(err, file) {
      if (!file) {
        res.send(404);
        return;
      }
      file.status = 'removed';
      file.save();
      res.send(200);
    });
  } else {
    res.send(404);
  }
};