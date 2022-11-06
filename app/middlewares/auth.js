require('dotenv').config()
const secret = process.env.JWT_TOKEN;

const jwt = require("jsonwebtoken");
//3 - exigir o modelo de usuário
const User = require("../models/user");
//criar o middleware
const WithAuth = (req, res, next) => {
//acessa o token do cabeçalho da requisição
    const token = req.headers['x-acess-token'];
    //se a senha não for a mesma - lança status de recurso indisponível e erro
    if (!token) {

        res.status(401).json({ error: "Unauthorized:  no Token provided" })
    } else {
        //use o método de verificação na jwt lib para decodificá-lo
        jwt.verify(token, secret, (err, decode) => {
            //o método de verificação lança um erro - lança o status e o erro do recurso indisponível
            if (err) {
                res.status(401).json({ error: "Unauthorized:  Token invalid" })
            } else {
                req.email = decode.email;
                User.findOne({ email: decode.email })
                    .then(user => {
                        req.user = user;
                        next()
                    }).catch(err => {
                        res.status(401).json({ error: err })
                    })

            }
        })
    }
}

module.exports = WithAuth;