const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authConfig = require('../../config/auth');

class SessionController {
    async store(req, res){
        var { email, password } = req.body;

        const userEmail = await User.findByEmail(email);
        
        if (userEmail.length > 0) {
            const user = await User.AutenticateByEmail(userEmail[0].email, password);

            if (user.length < 1) {
                return res.json({ error: "Senha incorreta." });
            } else {
                const { id } = user[0];
                
                return res.json({
                    user,
                    token: jwt.sign( { id }, authConfig.secret, {
                        expiresIn: authConfig.expiresIn
                    })
                })
            }
        } else {
            return res.json({error: "Email não encontrado."});
        }
    }    
}

module.exports = new SessionController();
