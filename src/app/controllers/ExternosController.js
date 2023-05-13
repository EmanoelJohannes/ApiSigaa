const path = require('path')
const fs = require('fs');

class externosControler {

  async getExternos (req, res) {
    let file = path.join(__dirname,'../files/projetos.json');

    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const externosData = JSON.parse(data);
          console.log(externosData)
          
          // Processa os dados utilizando o método reduce
          const result = externosData.reduce((acc, current) => {
            const departamentos = acc.departamentos;
            let totalManager = acc.totalManager;
            const managerFromDepartaments = acc.managerFromDepartaments;
            const years = new Set(acc.years);
          
            // Adiciona o ano à lista de anos encontrados
            current.forEach((projeto) => {
              years.add(parseInt(projeto.codigo.split('-')[1]));

              if(projeto.externo_equipe){
                projeto.externo_equipe.forEach((externo) => {
                  // Popula o array de departamentos
                  if (departamentos.indexOf(externo.Departamento) === -1) {
                    departamentos.push(externo.Departamento);
                  }
            
                  // Calcula o total de externos por departamento
                  const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === externo.Departamento);
                  if (departamentoIndex === -1) {
                    managerFromDepartaments.push([externo.Departamento, 1]);
                  } else {
                    managerFromDepartaments[departamentoIndex][1] += 1;
                  }
                });
              }
              // Calcula o total de externos do projeto
              totalManager += projeto.qntd_externo;
            });
          
            departamentos.sort();

            return { departamentos, totalManager, managerFromDepartaments, years: [...years] };
          }, { departamentos: [], totalManager: 0, managerFromDepartaments: [], years: [] });
          
          result.managerFromDepartaments.unshift(['Departamento', 'Quantidade']);

          callback(null, result);
        } catch (err) {
          console.log("Erro: ", err)
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

  async getExternosByYear (req, res) {
    let file = path.join(__dirname,'../files/externos.json');
    const year = req.params.year;

    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const externosData = JSON.parse(data);

          const filteredData = externosData.filter(data => data[0].codigo.includes(`-${year}`));

          // Processa os dados utilizando o método reduce
          const result = filteredData[0].reduce((acc, externo) => {
            const departamentos = acc.departamentos;
            let totalManager = acc.totalManager;
            const managerFromDepartaments = acc.managerFromDepartaments;
            
            externo.externo_equipe.forEach((element) => {
              // Popula o array de departamentos              
              if(departamentos.indexOf(element.Departamento) === -1) {
                console.log(departamentos)
                departamentos.push(element.Departamento);
              }
              // Calcula o total de externos por departamento
              const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === element.Departamento);
              if(departamentoIndex === -1) {
                managerFromDepartaments.push([element.Departamento, 1]);
              } else {
                managerFromDepartaments[departamentoIndex][1] += 1;
              }
            });
            
            // Calcula o total de externos
            totalManager += externo.externo.length;
          
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

module.exports = new externosControler();
