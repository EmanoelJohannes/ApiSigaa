const jwt = require('jsonwebtoken');
const util = require('util');

const authConfig = require('../../config/auth');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({error: "Token não providenciado"});
    }

    //Descarta a primeira posição (Bearer) e pega apenas o token
    const [, token] = authHeader.split(' ');

    try{
        const decoded = await util.promisify(jwt.verify)(token, authConfig.secret);

        req.userCpf = decoded.nucpf;
        
        return next();

    } catch {
        return res.status(401).json({error: "Token inválido"});
    }

}