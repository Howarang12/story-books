const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const expressLayouts = require('express-ejs-layouts')
const passport= require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

//load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}


//ejs
app.use(expressLayouts)
app.set('view engine', 'ejs')

//sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  })
)


//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))