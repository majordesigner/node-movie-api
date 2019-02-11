const mongoose = require('mongoose');

module.exports = () => {
    //mongoose.connect('mongodb://movie_admin:hg462636@ds121889.mlab.com:21889/movie-api', {useNewUrlParser: true});
    mongoose.connect('mongodb://localhost/movie-api', {useNewUrlParser: true});
    mongoose.connection.on('open', () => {
        console.log('MongoDb: Connected');
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDb: Error', err);
    }); 

    mongoose.Promise = global.Promise;
}