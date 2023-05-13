const User = require("../models/User");
const crypto = require('crypto');

class UserController {
  async getUsers(req, res) {
    const users = await User.getUsers();

    return res.json(users); 
  }

  async deleteUser(req, res) {
    const userDeleted = await User.deleteUser(req.params.cpf);

    return res.json(userDeleted);
  }

  async storeUser(req, res) {

    console.log(req.body);

    const emailExists = await User.findByEmail(req.body.email);
    
    console.log('emailExists', emailExists);

    if (emailExists[0]) {
      return res.json({ error: "Email já cadastrado." });
    } else {
      req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');

      const newUser = await User.storeUser(req.body);

      if (newUser) {
        // Agora que sabemos que existe, pois foi cadastrado, buscamos as informações
        const user = await User.findById(newUser);

        return res.json(user);
      } else {
        return res.json({error: "Usuário não adicionado." })
      }
    }
  }
}

module.exports = new UserController();
