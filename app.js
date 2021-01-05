/* Carregando módulos */
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); // usado para manipular diretórios

// Módulo para criar rotas da pasta routes
const admin = require('./routes/admin');
const mongoose = require('mongoose');

// Para trabalhar com sessions
const session = require('express-session');
const flash = require('connect-flash');

/* CONFIGS */
/* Sessão */
app.use(
  session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(flash());

/* Middleware */
app.use((req, res, next) => {
  res.locals.success = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

/* Body parser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Handlebars */
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/* Mongoose */
mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/blogapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado ao mongo');
  })
  .catch((err) => {
    console.log('Erro ao se conectar ' + err);
  });

/* Public */
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log('Es sou um MIDDLEWARE!');
  next();
});

/* ROTAS */
// Puxa as rotas da pasta routes com o prefixo admin
app.use('/admin', admin);

// cria rotas
app.get('/', (req, res) => {
  res.send('Página principal');
});

app.get('/posts', (req, res) => {
  res.send('Página de posts');
});

/* Outros */
const PORT = 8081;
app.listen(PORT, () => {
  console.log('servidor rodando! em localhost:' + PORT);
});
