require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');

// database
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3030;

// middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static('public'));

// handlebars
app.engine(
   'handlebars',
   exphbs({
      defaultLayout: 'main'
   })
);
app.set('view engine', 'handlebars');

// routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

const syncOptions = { force: false};

if (process.env.NODE_ENV === "test") {
   syncOptions.force = true;
}

// starting the server
db.sequelize.sync(syncOptions).then(function() {
   app.listen(PORT, function() {
      console.log(
         "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
         PORT,
         PORT
      );
   });
});