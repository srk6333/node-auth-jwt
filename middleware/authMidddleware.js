const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtToken;

    if(token){
        jwt.verify(token, 'secretkeyforhashing', (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect('/home');
            }else{
                console.log(decodedToken)
                next();
            }
        })
    }
    else{
        res.redirect('/home');
    }
}




module.exports = {requireAuth}