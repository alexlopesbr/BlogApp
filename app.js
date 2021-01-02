/* Carregando módulos */
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); // usado para manipular diretórios

// Módulo para criar rotas da pasta routes
const admin = require('./routes/admin');
const mongoose = require('mongoose');

/* Configs */
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

/* Rotas */
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
