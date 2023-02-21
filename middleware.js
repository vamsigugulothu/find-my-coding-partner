const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        if( !token ) return res.status(400).send("Token not found")
        const decodedToken = jwt.verify(token, 'jwtPassword');
        req.user = decodedToken.user;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(400).send("Authentication error")
    }
}   
