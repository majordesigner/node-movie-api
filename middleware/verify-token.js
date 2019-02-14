const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    let bearer = '';
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        bearer = req.headers.authorization.split(' ')[1];

    const token = req.headers['x-access-token'] || req.body.token || req.query.token || bearer; //Bearer Token

    if(token) {
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
            if(err) {
                res.json({
                    status:false,
                    message: 'Failed to authenticate token.'
                });
            }
            else {
                req.decode = decoded;
                next();
            }
        });
    }
    else {
        res.json({
            status: false,
            message: 'No token provided.'
        });
    }
};