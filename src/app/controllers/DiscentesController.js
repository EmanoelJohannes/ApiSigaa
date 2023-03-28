

const {spawn} = require('child_process');
const path = require('path')
const fs = require('fs');

class DiscentesController {

  async getDiscentes (req, res) {
    let file = path.join(__dirname,'../files/discentes.json');
    console.log("File: ", file)
    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {

          const discentesData = JSON.parse(data);
          console.log(discentesData)
          
          // Processa os dados utilizando o método reduce
          const result = discentesData.reduce((acc, current) => {
            const departamentos = acc.departamentos;
            let totalManager = acc.totalManager;
            const managerFromDepartaments = acc.managerFromDepartaments;
            const years = new Set(acc.years);
          
            // Adiciona o ano à lista de anos encontrados
            current.forEach((projeto) => {
              years.add(parseInt(projeto.codigo.split('-')[1]));
          
              projeto.discentes.forEach((discente) => {
                // Popula o array de departamentos
                if (departamentos.indexOf(discente.Departamento) === -1) {
                  departamentos.push(discente.Departamento);
                }
          
                // Calcula o total de discentes por departamento
                const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === discente.Departamento);
                if (departamentoIndex === -1) {
                  managerFromDepartaments.push([discente.Departamento, 1]);
                } else {
                  managerFromDepartaments[departamentoIndex][1] += 1;
                }
              });
          
              // Calcula o total de discentes do projeto
              totalManager += projeto.qntd_discentes;
            });
          
            departamentos.sort();
            console.log("Executou")
            return { departamentos, totalManager, managerFromDepartaments, years: [...years] };
          }, { departamentos: [], totalManager: 0, managerFromDepartaments: [], years: [] });
          
          result.managerFromDepartaments.unshift(['Departamento', 'Quantidade']);
          console.log("Resultado: ", result)
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


  async getDiscentesByYear (req, res) {
    let file = path.join(__dirname,'../files/discentes.json');
    const year = req.params.year;

    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const discentesData = JSON.parse(data);

          const filteredData = discentesData.filter(data => data[0].codigo.includes(`-${year}`));

          // Processa os dados utilizando o método reduce
          const result = filteredData[0].reduce((acc, discente) => {
            const departamentos = acc.departamentos;
            let totalManager = acc.totalManager;
            const managerFromDepartaments = acc.managerFromDepartaments;
            
            discente.discentes.forEach((element) => {
              // Popula o array de departamentos              
              if(departamentos.indexOf(element.Departamento) === -1) {
                departamentos.push(element.Departamento);
              }
              // Calcula o total de discentes por departamento
              const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === element.Departamento);
              if(departamentoIndex === -1) {
                managerFromDepartaments.push([element.Departamento, 1]);
              } else {
                managerFromDepartaments[departamentoIndex][1] += 1;
              }
            });
            
            // Calcula o total de discentes
            totalManager += discente.discentes.length;
          
            departamentos.sort();
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

module.exports = new DiscentesController();
