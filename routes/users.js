var express = require('express');
var router = express.Router();
const db = require('../models/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll().then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    }
    res.render('users/index', data)
  })
});

// 新規作成
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Users/Add',
    form: new db.User(),
    err: null
  }
  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  }
  db.sequelize.sync()
    .then(() => db.User.create(form))
    .then(usr => {
      res.redirect('/users');
    })
    .catch(err => {
      var data = {
        title: 'Users/Add',
        form: form,
        err: err
      }
      res.render('users/add', data)
    })
});

// ログイン処理
router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力してください。'
  }
  res.render('users/login', data)
});

router.post('/login', (req, res, next) => {
  db.User.findOne({
    where: {
      name:req.body.name,
      pass:req.body.pass,
    }
  }).then(usr => {
    if (usr != null) {
      req.session.login = usr;
      let back = req.session.back;
      if (back == null) {
        back = '/';
      }
      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力して下さい。'
      }
      res.render('users/login', data);
    }
  })
});
module.exports = router;
