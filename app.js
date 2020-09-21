const path      = require('path')
const express   = require('express')
const mongoose  = require('mongoose')
const dotenv    = require('dotenv')
const morgan    = require('morgan')
const methodOverride    = require('method-override')
const exphbs    = require('express-handlebars')
const passport  = require('passport')
const session   = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

/** load config firstly */

dotenv.config({path:  path.join(__dirname,'config','config.env')})

/** passport config */
require('./config/passport')(passport)

/** connect with DB */
connectDB();

/** init app with express*/
const app = express();

/** add body parser */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/** method override*/
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))


/** morgan logger on dev mode */
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

/** handlebars helper*/
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

/** handlebars middleware */
app.engine('.hbs', exphbs({
        helpers: {
            formatDate,
            truncate,
            stripTags,
            editIcon,
            select
        },
        defaultLayout: 'main',
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

/** session middleware */
app.set('trust proxy', 1) // trust first proxy
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

/** passport middleware */
app.use(passport.initialize());
app.use(passport.session()); // works with express session

/** set global variable*/
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

/** static folder */
app.use(express.static(path.join(__dirname,'public')))

/** routes */
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

/** get port from env or 3000 as default*/
const PORT = process.env.PORT || 3000;

/** start listening on app */
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

/**
 * @description to start the app run `npm run dev` (npm run start) in console
 */
