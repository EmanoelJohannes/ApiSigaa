var db = require("../../config/dbConnection");
const crypto = require('crypto');

class UserModel {

  async getUsers() {
    var result;

    await db("usuario")
      .select("*")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUsers Model => ", erro);
        return;
      });

    return result;
  }

  async deleteUser(id) {
    var result;

    await db("usuario")
      .where("id", "=", id)
      .del()
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUsers Model => ", erro);
        return;
      });

    return result;
  }

  async storeUser(data) {
    var result;
    
    await db("usuario")
      .insert(data)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeUser Model => ", erro);
        return;
      });

    return result;
  }

  async AutenticateByEmail(email, password) {
    var result;

    password = crypto.createHash('md5').update(password).digest('hex')

    await db("usuario")
      .select('usuario.*')
      .where({
        email: email,
        password: password
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro Autenticate Model => ", erro);
        return;
      });

    return result;
  }

  async findByEmail(email) {
    var result;

    await db("usuario")
      .select('*')
      .where({
        email
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro findByEmail Model => ", erro);
        return;
      });

    return result;
  }

  async findById(id) {
    var result;

    await db("usuario")
      .select('id', 'name', 'email')
      .where({
        id
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro findById Model => ", erro);
        return;
      });

    return result;
  }

}

module.exports = new UserModel();
