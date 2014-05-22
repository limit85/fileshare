'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    files = require('./controllers/files'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);
  app.route('/api/files/upload')
    .post(files.upload);
  app.route('/api/files/search/:searchStr')
    .get(files.search);
  app.route('/api/files/tags')
    .get(files.tags_list);
  app.route('/api/files')
    .put(files.update);
  app.route('/api/files/:fileId/download')
    .get(files.download);
  app.route('/api/files/:fileId')
    .get(files.getFileInfo)
    .delete(files.remove);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};