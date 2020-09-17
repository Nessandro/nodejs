const path      = require('path')
const express   = require('express')
const dotenv    = require('dotenv')
const morgan    = require('morgan')
const exphbs    = require('express-handlebars');
const connectDB = require('./config/db')


//load config firstly
dotenv.config({path:  path.join(__dirname,'config','config.env')})

//connect with DB
connectDB();

/* init app with express*/
const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/', require('./routes/index'))

/* get port from env or 3000 as default*/
const PORT = process.env.PORT || 3000;

/* start listening on app */
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

//to start the app run `npm run dev` (npm run start) in console