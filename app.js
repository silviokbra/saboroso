var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session)
var client = redis.createClient();
var formidable = require('formidable');
var http = require('http');
var socket = require('socket.io');
var path = require('path');

var app = express();

var http = http.Server(app);
var io = socket(http);

io.on('connection', function (socket) {

  console.log('Novo usuario conectado');

});

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

app.use(function (req, res, next) {

  if ((req.method === 'POST') && (req.path != '/admin/login')) {

    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true
    });

    form.parse(req, function (err, fields, files) {

      req.body = fields;
      req.fields = fields;
      req.files = files;

      next();

    });
  } else {

    next();
  }

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Criando o cliente Redis
const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1', // Força IPv4 ao invés de ::1
    port: 6379
  }
});

// Captura erros do Redis
redisClient.on('error', (err) => console.log('Erro no Redis:', err));

// Garante que o Redis está conectado antes de passar para a sessão
redisClient.connect().then(() => {
  console.log('Redis conectado com sucesso!');

  // Configuração da sessão com RedisStore



}).catch(console.error);

app.use(session({
  // store: new RedisStore({ client: redisClient }),
  secret: 'p@ssw0rd',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true apenas se estiver em produção com HTTPS
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(3000, function () {

  console.log('servidor em execução');

});

