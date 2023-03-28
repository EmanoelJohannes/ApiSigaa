

const {spawn} = require('child_process');
const path = require('path')
const fs = require('fs');

class DiscentesController {

  async getDiscentes (req, res) {
    let file = path.join(__dirname,'../files/discentes.json');
    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {

          const discentesData = JSON.parse(data);
          
          // Processa os dados utilizando o método reduce
          const result = discentesData.reduce((acc, current) => {
            const departamentos = acc.departamentos;
            let totalDiscentes = acc.totalDiscentes;
            const discentesFromDepartaments = acc.discentesFromDepartaments;
            const years = new Set(acc.years);
          
            // Adiciona o ano à lista de anos encontrados
            current.forEach((projeto) => {
              years.add(parseInt(projeto.codigo.split('-')[1]));
          
              projeto.discente.forEach((discente) => {
                // Popula o array de departamentos
                if (departamentos.indexOf(discente.Departamento) === -1) {
                  departamentos.push(discente.Departamento);
                }
          
                // Calcula o total de discentes por departamento
                const departamentoIndex = discentesFromDepartaments.findIndex((d) => d[0] === discente.Departamento);
                if (departamentoIndex === -1) {
                  discentesFromDepartaments.push([discente.Departamento, 1]);
                } else {
                  discentesFromDepartaments[departamentoIndex][1] += 1;
                }
              });
          
              // Calcula o total de discentes do projeto
              totalDiscentes += projeto.qntd_discente;
            });
          
            departamentos.sort();
            return { departamentos, totalDiscentes, discentesFromDepartaments, years: [...years] };
          }, { departamentos: [], totalDiscentes: 0, discentesFromDepartaments: [], years: [] });
          
          result.discentesFromDepartaments.unshift(['Departamento', 'Quantidade']);
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
            let totalDiscentes = acc.totalDiscentes;
            const discentesFromDepartaments = acc.discentesFromDepartaments;
            
            discente.discentes.forEach((element) => {
              // Popula o array de departamentos              
              if(departamentos.indexOf(element.Departamento) === -1) {
                departamentos.push(element.Departamento);
              }
              // Calcula o total de discentes por departamento
              const departamentoIndex = discentesFromDepartaments.findIndex((d) => d[0] === element.Departamento);
              if(departamentoIndex === -1) {
                discentesFromDepartaments.push([element.Departamento, 1]);
              } else {
                discentesFromDepartaments[departamentoIndex][1] += 1;
              }
            });
            
            // Calcula o total de discentes
            totalDiscentes += discente.discentes.length;
          
            departamentos.sort();
            return { departamentos, totalDiscentes, discentesFromDepartaments };
          }, { departamentos: [], totalDiscentes: 0, discentesFromDepartaments: [] });
  
          result.discentesFromDepartaments.unshift(['Departamento', 'Quantidade']);

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
