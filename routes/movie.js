const express = require('express');
const router = express.Router();

//Model
const Movie = require('../models/Movie');


// Tüm filmleri getiren sorgu
router.get('/', (req, res) => {
  const promise = Movie.find({});

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// Top 10 listesi çekme
router.get('/top10', (req, res) => {
  const promise = Movie.find({}).limit(10).sort({ imdb_score: -1 });

  promise.then((movie) => {
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

// id bilgisi ile tek bir filmi getiren sorgu
router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);

  promise.then((movie) => {
    // Hatayı özelleştirme. movie boş gelirse bu hatayı bas diyoruz. bunun ayarı: app.js içinde res.json - error lu kısımda da yapılıyor.
    if(!movie)
      next({ message: 'The movie was not found.', code: 1 });

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

// Film güncelleme - id bilgisine göre güncelleme - Tüm obheyi güncelleyebildiğimiz gibi sadece belli parametleri de göndersek güncellenir.
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, { new: true});

  promise.then((movie) => {
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });

});

// Film silme işlemi
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise.then((movie) => {
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

// Between
// $gte : büyük ya da eşit
// $lte : küçük ya da eşit
// $gt : büyük
// $lt : küçük
router.get('/between/:start_year/:end_year', (req, res) => {
  const {start_year, end_year} = req.params;

  const promise = Movie.find(
    {
      year: {"$gte": parseInt(start_year), "$lte": parseInt(end_year)}
    }
  );

  promise.then((movie) => {
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

router.post('/', (req, res, next) => {
  //const { title, imdb_score, category, country, year } = req.body;

  /*
  const movie = new Movie({
    title: title,
    imdb_score: imdb_score,
    category: category,
    countr: country,
    year: year
  });
  */

   /*
  movie.save((err, data) => {
    if(err)
      res.json(err);

    res.json(data);
  });
  */

  const movie = new Movie(req.body);

  const promise  = movie.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});

module.exports = router;
