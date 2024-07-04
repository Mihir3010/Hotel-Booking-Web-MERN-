require('dotenv').config();
const url = require('url');
const jwt = require('jsonwebtoken');

module.exports = async function(req,res,next){
   if(req.url == '/api/auth/login' || req.url.includes('/api/auth/') || req.url.includes('/api/customer/'))
    next()
   else
   {
    var token = req.headers.authorization;
    if(!token)
        token = url.parse(req.url, true).query['api_key'];
    if(token)
    {
        try{
            var decode = jwt.verify(token,'hotel-secret-key');
        }
        catch(err){
            res.status(401).json({error: "THe session expired. Please try to sign in again", status:401});
        }
        if(decode)
        {
            req.decode = decode;
            if(req.decode)
            {
                var dateNow = Date.now()/1000;
                if(req.decode.exp < dateNow)
                    res.status(401).json({error: "The session expired. Please try to sign in again", status:401});
                else if((req.decode.exp - dateNow) < 300)
                    next();
                else
                    next();
            }
        }
    }
    else
        res.status(401).json({error: "Bad token.", status:401});
   }
}