const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Model
const Director = require('../models/Director');

router.post('/', (req, res) => {
  const director = new Director(req.body);

  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// Tüm directorların listesi döndürülür ama Film listesinde olan filmleri de eklenerek. Join işlemleri
router.get('/', (req, res) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true // Joine dahil olamayan filmi olmayan yönetmenleri de listede görebilmek için kullanılır.
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        }, // Director bilgisi için yeni bi obje düzenliyor
        movies: {
          $push: '$movies'
        } // movieler için oluşturulan kayıtları da bu obje altında toparlıyor.
      }
    },
    { // group ile oluşan yonetmen bilgisini tutan objeden kurtulmak için böyle bişey yapılıyor.
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// İd bilgisi ile belli bir yonetmene ait datalar çekilir. Üsttekinden tek farkı aggregate içerisine $match keywordu ekledik.
router.get('/:director_id', (req, res) => {
  const promise = Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true // Joine dahil olamayan filmi olmayan yönetmenleri de listede görebilmek için kullanılır.
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        }, // Director bilgisi için yeni bi obje düzenliyor
        movies: {
          $push: '$movies'
        } // movieler için oluşturulan kayıtları da bu obje altında toparlıyor.
      }
    },
    { // group ile oluşan yonetmen bilgisini tutan objeden kurtulmak için böyle bişey yapılıyor.
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });  
});

// Yönetmen güncelleme
router.put('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body,
    {
      new: true
    }
  );

  promise.then((director) => {
    res.json(director);
  }).catch((err) => {
    res.json(err);
  }); 
});

// Yönetmen silme işlemi
router.delete('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndRemove(req.params.director_id);

  promise.then((director) => {
    res.json(director);
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;
