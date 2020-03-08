const db = require('../models');

module.exports = function(app) {
   // load index page 
   app.get('/', function(req, res) {
      db.Example.findAll({}).then(function(dbExamples){
         res.render('index', {
            msg: 'Welcome!',
            examples: dbExamples
         });
      });
   });

   // load example page and pass in an example id
   app.get('/movies/:id', function (req,res) {
      db.Movie.findOne({ where: { id: req.params.id } }).then(function(dbMovie) {
         res.render('index', {
            movie: dbMovie
         });
      });
   });

   // delete instance
   app.delete('/api/movies/:id', function(req,res) {
      db.Movie.destroy({ where: { id: req.params.id } }).then(function(dbMovie) {
         res.json(dbMovie);
      });
   });

   // render 404 page for any unmatched routes
   app.get('*', function(req, res) {
      res.render('404');
   });
};