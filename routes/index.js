const express = require('express');
const router = express.Router();


// parola kullanma durumlarında şifreyi hashlemek için kullanılır. Şifrelemek için hash şifreyi geri çözümlemek için compare methodu kullanılır.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Model
const User = require('../models/User');

// Localstorage
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
  const {username, password} = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username,
      password: hash
    });
  
    const promise = user.save();
  
    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
  });
});

router.get('/authenticate', (req, res) => {
  res.render('authenticate', {token: localStorage.getItem('token')});
});

router.post('/authenticate', (req, res) => {
  const {username, password} = req.body;

  User.findOne({
    username
  }, (err, user) => {
    if(err)
      throw err;

    if(!user) {
      res.json({
        status: false,
        message: 'Authentication failed, User not found.'
      });
    }
    else {
      bcrypt.compare(password, user.password).then((result) => {
        if(!result) {
          res.json({
            status:false,
            message: 'Authentication failed, Wrong password.'
          });
        }
        else {
          const payload = {
            username
          }

          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 720 // dakika cinsindendir. 12 saat eder.
          });

          // Local Storage'ı setliyorum ama Node local storage'ı bu browser değil.
          localStorage.setItem('token', token);

          const getToken = localStorage.getItem('token');
          
          res.json({
            status: true,
            token
          });

          // jade sayfası döndürüyorum.
          //res.render('profile', {jwt_token: getToken});
        }
      });
    }
  });
});

module.exports = router;
