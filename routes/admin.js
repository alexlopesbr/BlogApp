const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
require('../models/Categorias');
const Categoria = mongoose.model('categorias');

router.get('/', (req, res) => {
  res.render('admin/index');
});

router.get('/posts', (req, res) => {
  res.send('Página de posts ADM');
});

router.get('/categorias', (req, res) => {
  Categoria.find()
    .sort({ date: 'desc' })
    .lean()
    .then((categorias) => {
      res.render('admin/categorias.handlebars', { categorias: categorias });
    })
    .catch((err) => {
      req.flash('error_msg', 'Houve um erro ao listar as categorias' + err);
      res.redirect('http://localhost:8080/admin');
    });
});

router.get('/categorias/add', (req, res) => {
  res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res) => {
  var erros = [];

  if (req.body.nome.length < 2) {
    erros.push({ texto: 'Nome da categoria muito curto' });
  }

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: 'Nome inválido' });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: 'slug inválido' });
  }

  if (erros.length > 0) {
    res.render('admin/addcategorias', { erros: erros });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };

    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso');
        res.redirect('/admin/categorias');
      })
      .catch((err) => {
        req.flash('error_msg', 'Erro ao salvar a categoria');
        res.redirect('/admin');
      });
  }
});

module.exports = router;
