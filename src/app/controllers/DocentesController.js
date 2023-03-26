

const {spawn} = require('child_process');
const path = require('path')
const fs = require('fs');

class UserController {

  async getDocentes (req, res) {
    let file = path.join(__dirname,'../files/docentes.json');

    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);

          // Processa os dados utilizando o método reduce
          const result = docentesData.reduce((acc, docente) => {
            const departamentos = acc.departamentos;
            let totalManager = acc.totalManager;
            const managerFromDepartaments = acc.managerFromDepartaments;
            docente.docentes.forEach((element) => {
              // Popula o array de departamentos              
              if(departamentos.indexOf(element.Departamento) === -1) {
                departamentos.push(element.Departamento);
              }

              // Calcula o total de docentes por departamento
              const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === element.Departamento);
              if(departamentoIndex === -1) {
                managerFromDepartaments.push([element.Departamento, 1]);
              } else {
                managerFromDepartaments[departamentoIndex][1] += 1;
              }
            });
            
            // Calcula o total de docentes
            totalManager += docente.docentes.length;
            return { departamentos, totalManager, managerFromDepartaments };
          }, { departamentos: [], totalManager: 0, managerFromDepartaments: [] });
  
          result.managerFromDepartaments.unshift(['Departamento', 'Quantidade']);

          callback(null, result);
        } catch (err) {
          callback(err);
        }
      });
    }
  
    readJson(file, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  }

  async getDocentesByYear (req, res) {
    let file = path.join(__dirname,'../files/docentes.json');
    const year = req.params.year;

    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);

          // Processa os dados utilizando o método reduce
          const result = docentesData.reduce((acc, docente) => {
            const departamentos = acc.departamentos;
            let totalManager = acc.totalManager;
            const managerFromDepartaments = acc.managerFromDepartaments;
            docente.docentes.forEach((element) => {
              // Popula o array de departamentos              
              if(departamentos.indexOf(element.Departamento) === -1) {
                departamentos.push(element.Departamento);
              }

              // Calcula o total de docentes por departamento
              const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === element.Departamento);
              if(departamentoIndex === -1) {
                managerFromDepartaments.push([element.Departamento, 1]);
              } else {
                managerFromDepartaments[departamentoIndex][1] += 1;
              }
            });
            
            // Calcula o total de docentes
            totalManager += docente.docentes.length;
            return { departamentos, totalManager, managerFromDepartaments };
          }, { departamentos: [], totalManager: 0, managerFromDepartaments: [] });
  
          result.managerFromDepartaments.unshift(['Departamento', 'Quantidade']);

          callback(null, result);
        } catch (err) {
          callback(err);
        }
      });
    }
  
    readJson(file, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  }
}

module.exports = new UserController();
