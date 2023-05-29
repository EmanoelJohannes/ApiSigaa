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

    async authenticate(req, res){
        const authHeader = req.headers.authorization;        

        if (!authHeader) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      
        try {
          // Verificar e decodificar o token

          const [, token] = authHeader.split(' ');

          const decoded = jwt.verify(token, authConfig.secret);
          const { id } = decoded;
      
          // Buscar o usuário com base no ID
          const user = await User.findById(id);
          
          console.log(user[0]);

          if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
      
          // Retornar as informações do usuário
          return res.json(user[0]);
        } catch (error) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    }    
}

module.exports = new SessionController();
