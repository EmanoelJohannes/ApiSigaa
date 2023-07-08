const path = require('path')
const fs = require('fs');

class externosControler {

  async getExternos (req, res) {
    let fileRead = req.query.type
    if(!fileRead){
      fileRead = 'projetos'
    }
    const FILE = path.join(__dirname, `../files/${fileRead}.json`);


    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const externosData = JSON.parse(data);
          
          // Processa os dados utilizando o método reduce
          const result = externosData.reduce((acc, current) => {
            const departamentos = acc.departamentos;
            let totalPeoples = acc.totalPeoples;
            const peoplesFromDepartaments = acc.peoplesFromDepartaments;
            const years = new Set(acc.years);
            const yearsPeople = acc.yearsPeople;

            
          
            // Adiciona o ano à lista de anos encontrados
            current.forEach((projeto) => {
                years.add(parseInt(projeto.codigo.split('-')[1]));

                const year = parseInt(projeto.codigo.split("-")[1]);

              
                // Verifica se o ano já está presente no objeto de resultados
                const index = yearsPeople.findIndex(
                  (item) => item[0] === year
                );
                if (index === -1) {
                  yearsPeople.push([year, projeto.qntd_externo]);
                } else {
                  yearsPeople[index][1] += projeto.qntd_externo;
                }

              if(projeto.externo_equipe){
                projeto.externo_equipe.forEach((externo) => {
                  // Popula o array de departamentos
                  if (departamentos.indexOf(externo.Departamento) === -1) {
                    departamentos.push(externo.Departamento);
                  }
            
                  // Calcula o total de externos por departamento
                  const departamentoIndex = peoplesFromDepartaments.findIndex((d) => d[0] === externo.Departamento);
                  if (departamentoIndex === -1) {
                    peoplesFromDepartaments.push([externo.Departamento, 1]);
                  } else {
                    peoplesFromDepartaments[departamentoIndex][1] += 1;
                  }
                });
              }
              // Calcula o total de externos do projeto
              totalPeoples += projeto.qntd_externo;
            });
          
            departamentos.sort();

            return { departamentos, totalPeoples, peoplesFromDepartaments, years: [...years], yearsPeople };
          }, { departamentos: [], totalPeoples: 0, peoplesFromDepartaments: [], years: [], yearsPeople: [] });
          
          result.peoplesFromDepartaments.unshift(['Departamento', 'Quantidade']);
          result.yearsPeople.unshift(["Ano", "Total"]);

          callback(null, result);
        } catch (err) {
          callback(err);
        }
      });
    }
  
    readJson(FILE, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  }

  async getExternosByYear(req, res) {
    const year = req.params.year;
    let fileRead = req.query.type
    if(!fileRead){
      fileRead = 'projetos'
    }
    const FILE = path.join(__dirname, `../files/${fileRead}.json`);


    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const externosData = JSON.parse(data);

          const filteredData = externosData.filter((data) =>
            data[0].codigo.includes(`-${year}`)
          );

          // Processa os dados utilizando o método reduce
          const result = filteredData[0].reduce(
            (acc, externo) => {
              const departamentos = acc.departamentos;
              let totalPeoples = acc.totalPeoples;
              const peoplesFromDepartaments = acc.peoplesFromDepartaments;

              externo.externo_equipe.forEach((element) => {
                // Popula o array de departamentos
                if (departamentos.indexOf(element.Departamento) === -1) {
                  departamentos.push(element.Departamento);
                }
                // Calcula o total de externos por departamento
                const departamentoIndex = peoplesFromDepartaments.findIndex(
                  (d) => d[0] === element.Departamento
                );
                if (departamentoIndex === -1) {
                  peoplesFromDepartaments.push([element.Departamento, 1]);
                } else {
                  peoplesFromDepartaments[departamentoIndex][1] += 1;
                }
              });

              // Calcula o total de externos
              totalPeoples += externo.qntd_externo;

              departamentos.sort();
              return { departamentos, totalPeoples, peoplesFromDepartaments };
            },
            { departamentos: [], totalPeoples: 0, peoplesFromDepartaments: [] }
          );

          result.peoplesFromDepartaments.unshift([
            "Departamento",
            "Quantidade",
          ]);

          callback(null, result);
        } catch (err) {
          callback(err);
        }
      });
    }

    readJson(FILE, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  }


  async getDepartamentInYears(req, res) {
    const departament = req.body;
    let fileRead = req.query.type
    if(!fileRead){
      fileRead = 'projetos'
    }
    const FILE = path.join(__dirname, `../files/${fileRead}.json`);


    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const discentesData = JSON.parse(data);

          let firstArrayDep = [];

          firstArrayDep.push('Ano');

          departament.forEach((dep) => {
            firstArrayDep.push(dep);
          });

          // Processa os dados utilizando o método reduce
          const result = discentesData.reduce(
            (acc, discente) => {
              const departamentYears = acc.departamentYears || [];
              const newDepartamentYears = acc.newDepartamentYears || [];

              discente.forEach((member) => {
                const year = parseInt(member.codigo.split('-')[1]);

                member.externo_equipe.forEach((element) => {
                  departament.forEach((dep) => {
                    if (element.Departamento === dep) {
                      const index = departamentYears.findIndex(
                        (el) => el[0] === year
                      );
                      const indexYear = newDepartamentYears.findIndex(
                        (el) => el[0] === year
                      );
                      const indexDep = firstArrayDep.findIndex(
                        (el) => el === dep
                      );

                      if (departamentYears.length) {
                        if (index === -1) {
                          departamentYears.push([year, 1]);
                        } else {
                          departamentYears[index][1] += 1;
                        }
                      } else {
                        departamentYears.push([year, 1]);
                      }

                      if (newDepartamentYears.length) {
                        if (indexYear === -1) {
                          newDepartamentYears.push([year, 1]);
                        } else {
                          if (!newDepartamentYears[indexYear][indexDep]) {
                            newDepartamentYears[indexYear][indexDep] = 1;
                          } else {
                            newDepartamentYears[indexYear][indexDep] += 1;
                          }
                        }
                      } else {
                        newDepartamentYears.push([year, 1]);
                      }
                    }
                  });
                });
              });

              return { departamentYears, newDepartamentYears };
            },
            { departamentYears: [], newDepartamentYears: [] }
          );

          // Processa os dados utilizando o método reduce
          const resultTeste = discentesData.reduce(
            (acc, discente) => {
              const yearDepartmentCounts = acc.yearDepartmentCounts || {};

              discente.forEach((member) => {
                const year = parseInt(member.codigo.split('-')[1]);

                member.externo_equipe.forEach((element) => {
                  const department = element.Departamento;
                  if (firstArrayDep.includes(department)) {
                    yearDepartmentCounts[year] =
                      yearDepartmentCounts[year] || {};
                    yearDepartmentCounts[year][department] =
                      yearDepartmentCounts[year][department] || 0;
                    yearDepartmentCounts[year][department] += 1;
                  }
                });
              });

              return { yearDepartmentCounts };
            },
            { yearDepartmentCounts: {} }
          );

          // Organiza os dados no formato de matriz
          const matrixData = [['Ano', ...firstArrayDep]];
          Object.keys(resultTeste.yearDepartmentCounts).forEach((year) => {
            const departmentCounts = resultTeste.yearDepartmentCounts[year];
            const row = [parseInt(year)];
            firstArrayDep.forEach((department) => {
              row.push(departmentCounts[department] || 0);
            });
            matrixData.push(row);
          });

          matrixData.forEach((arr) => {
            arr.splice(1, 1);
          });

          callback(null, { result, matrixData });
        } catch (err) {
          callback(err);
        }
      });
    }

    readJson(FILE, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  }


}

module.exports = new externosControler();
