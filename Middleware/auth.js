const jwt = require('jsonwebtoken');

const secretKey = "astaganagadragonballmantapjiwa";

const userData ={
    username : "",
    password:"",
    role:"",
}

const token = jwt.sign(userData,secretKey,{expiresIn:'24h'});
