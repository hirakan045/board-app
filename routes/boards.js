const express = require('express');
const router =express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");

const pnum = 10;

// ログインチェック
function check(req, res) {
  if (req.session.login == null ) {
    req.session.back = '/boards';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}


// トップページ
router.get('/', (req, res, next) => {
  res.redirect('/boards/0');
});

// トップページにページ番号を付けてアクセス
router.get('/:page', (req, res, next) => {
  if (check(req, res)) { return };
  const pg = req.params.page * 1;
  db.Board.findAll({
    offset: pg * pnum,
    limit: pnum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login: req.session.login,
      content: brds,
      page: pg
    }
    res.render('boards/index', data)
  });
});

// メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
  if (check(req, res)) { return };
  db.sequelize.sync()
    .then(() => db.Board.create({
      userId: req.session.login.id,
      message: req.body.msg
    })
    .then(brd => {
      res.redirect('/boards');
    })
    )
});

// 利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
  if (check(req, res)) { return };
  const id = req.params.id * 1;
  const pg = req.params.page * 1;
  db.Board.findAll({
    where: {userId: id},
    limit: pnum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login: req.session.login,
      userId: id,
      userName: req.params.user,
      content: brds,
      page: pg
    }
    res.render('board/home', data);
  });
});
module.exports = router;