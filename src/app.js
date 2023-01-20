const express = require('express');
const morgan = require('morgan');
const path = require('path');
const {engine} = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const {database} = require('./key');

// Inicializaciones
const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3800);
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({
    secret: 'vrsrsecretkeyventa',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());

// Variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Rutas
app.use(require('./routes/index'));

// Archivos publicos
app.use(express.static(path.join(__dirname, 'public')));

// Inicializacion del servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto:', app.get('port'));
});