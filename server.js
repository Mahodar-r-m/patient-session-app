const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
// Third party middleware
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const cors = require('cors');
// Security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Front-end packages
var $ = require('jquery');
const Swal = require('sweetalert2');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

// Load env vars
dotenv.config({ path: './config/.env' });

// Connect to database
connectDB();

// Route files
const index = require('./routes/index');
const patientRoutes = require('./routes/patientRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const psychiatristRoutes = require('./routes/psychiatristRoutes');

const app = express();

// Body parser = used to read data from front-end (Previously we need to install body parser but now it's included in express)
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// app.use(morgan('combined'));


// Sanitize data
app.use(mongoSanitize()); // To prevent sql injection

// Set security headers
app.use(helmet.contentSecurityPolicy({
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com"], // Content Security Policy (CSP) Error on AWS
styleSrc: ["'self'", "'unsafe-inline'", "https://stackpath.bootstrapcdn.com", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"], // Allow styles in AWS
fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"], // Add font sources here
connectSrc: ["'self'", "https://api.elasticemail.com"],
}
}));

// Prevent XSS(Cross Site Scripting) Attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1000 // 1000 requests per 1 mins
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//set the template engine 
app.use(expressLayouts); // to use layouts package
app.set('layout', './layouts/basic'); // Custom name for layout file
app.set('view engine', 'ejs');

// Fetch data from the request  
app.use(bodyParser.urlencoded({ extended: false }));

//set the path of the jquery file to be used from the node_module jquery package  
app.use('/jquery', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));
app.use('/css', express.static(path.join(__dirname + '/public/css')));
app.use('/js', express.static(path.join(__dirname + '/public/js')));
app.use('/images', express.static(path.join(__dirname + '/public/img')));

//set path for sweetalert2
app.use('/sweetalert2', express.static(path.join(__dirname + '/node_modules/sweetalert2/dist/')));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// // Mount routers
app.use('/', index);
app.use('/patients', patientRoutes);
app.use('/sessions', sessionRoutes);
app.use('/psychiatrists', psychiatristRoutes);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    // res.status(404).render('partials/notfound', { title: 'SDP | Page Not Found', css: 'notfound', js: 'notfound' })
    res.send('Success')
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
    // In order to exit application with failure '1' is used in exit call
});
// This error handling is created to crash the app when not connected with database