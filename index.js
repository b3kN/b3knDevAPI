// Set global constants
global.App    = __dirname + '/app/';

// Get all other global paths
require('./config/global-paths');

// Initialize Express Application
const express = require('express');
const app     = express();

// Initialize helpers
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const https       = require('https');
const cors        = require('cors');
const fs          = require('fs');

// Initialize Routes
const routes = require(global.Routes);

// Initialize Managers
const ValidationManager = require(Managers + 'validation');
const authManager       = require(Managers + 'auth');
const validationManager = new ValidationManager();

// Initialize Config
const config = require(global.Config);

let options = {
  key: fs.readFileSync('/etc/nginx/ssl/illustrious.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/illustrious.crt')
};

// Connect to DB
mongoose.Promise  = global.Promise;
mongoose.connect(config.db.mongoURL, { useMongoClient: true });

var corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Use json formatter middleware
app.use(bodyParser.json());
app.use(authManager.providePassport().initialize());

// Set Up validation middleware
app.use(validationManager.provideDefaultValidator());

// Setup routes
app.use('/', routes);

https.createServer(options, app).listen(config.server.port, function () {
  console.log('App is running on ' + config.server.port);
});