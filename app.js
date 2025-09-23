require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const ejs = require('ejs');
const path = require('path')

const DbConnection = require('./app/config/dbCon')
DbConnection()

const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(session({
    secret: 'secrect',
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
  if (req.cookies && req.cookies.userToken) {
    jwt.verify(req.cookies.userToken, process.env.JWT_SECRET || "hellowelcometowebskittersacademy123456", (err, data) => {
      if (!err) {
        res.locals.user = data;
      }
    });
  }
  next();
});


app.use((req, res, next) => {
  if (req.cookies && req.cookies.adminToken) {
    jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET_ADMIN || "hellowelcomeAdmin123456", (err, data) => {
      if (!err) {
        res.locals.admin = data;
      }
    });
  }
  next();
});


app.use(flash())

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')))

const ejsRouter = require('./app/router/ejsRouter')
app.use(ejsRouter)
const userRouter = require('./app/router/userRouter')
app.use(userRouter)
const adminRouter = require('./app/router/adminRouter')
app.use(adminRouter)
const categoryRouter = require('./app/router/categoryRouter')
app.use(categoryRouter)
const productRouter = require('./app/router/productRouter')
app.use(productRouter)

const PORT = 5700
app.listen(PORT, () => {
  console.log(`Server is running this url http://localhost:${PORT}`);

})