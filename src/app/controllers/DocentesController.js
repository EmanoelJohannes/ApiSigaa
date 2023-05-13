const path = require("path");
const fs = require("fs");

const FILE = path.join(__dirname, "../files/projetos.json");

class UserController {
  async getDocentes(req, res) {
    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);
          // Processa os dados utilizando o método reduce
          const result = docentesData.reduce(
            (acc, current) => {
              const departamentos = acc.departamentos;
              let totalManager = acc.totalManager;
              const managerFromDepartaments = acc.managerFromDepartaments;
              const years = new Set(acc.years);
              const yearsDocentes = acc.yearsDocentes;

              // Adiciona o ano à lista de anos encontrados
              current.forEach((projeto) => {
                const year = parseInt(projeto.codigo.split("-")[1]);

                // Adiciona o ano à lista de anos encontrados
                years.add(year);

                // Verifica se o ano já está presente no objeto de resultados
                const index = yearsDocentes.findIndex(
                  (item) => item[0] === year
                );
                if (index === -1) {
                  yearsDocentes.push([year, projeto.qntd_docentes]);
                } else {
                  yearsDocentes[index][1] += projeto.qntd_docente;
                }

                projeto.docentes.forEach((docente) => {
                  // Popula o array de departamentos
                  if (departamentos.indexOf(docente.Departamento) === -1) {
                    departamentos.push(docente.Departamento);
                  }

                  // Calcula o total de docentes por departamento
                  const departamentoIndex = managerFromDepartaments.findIndex(
                    (d) => d[0] === docente.Departamento
                  );
                  if (departamentoIndex >= 0) {
                    managerFromDepartaments[departamentoIndex][1] += 1;
                  } else {
                    managerFromDepartaments.push([docente.Departamento, 1]);
                  }
                });

                // Calcula o total de docentes do projeto
                totalManager += projeto.qntd_docente;
              });

              departamentos.sort();

              return {
                departamentos,
                totalManager,
                managerFromDepartaments,
                years: [...years],
                yearsDocentes,
              };
            },
            {
              departamentos: [],
              totalManager: 0,
              managerFromDepartaments: [],
              years: [],
              yearsDocentes: [],
            }
          );

          result.managerFromDepartaments.unshift([
            "Departamento",
            "Quantidade",
          ]);

          result.yearsDocentes.unshift(["Ano", "Total"]);

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

  async getDocentesNaoRepetidos(req, res) {
    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);

          const result = docentesData.reduce(
            (acc, current) => {
              const departamentos = acc.departamentos;
              let totalManager = acc.totalManager;
              const managerFromDepartaments = acc.managerFromDepartaments;
              const years = new Set(acc.years);
              const yearsDocentes = acc.yearsDocentes;
              const docentesContados = acc.docentesContados || {};

              current.forEach((projeto) => {
                const year = parseInt(projeto.codigo.split("-")[1]);
                years.add(year);

                if (!yearsDocentes.some((item) => item[0] === year)) {
                  yearsDocentes.push([year, projeto.qntd_docentes]);
                } else {
                  const index = yearsDocentes.findIndex((item) => item[0] === year);
                  yearsDocentes[index][1] += projeto.qntd_docente;
                }

                let docentesNaoContados = projeto.docentes.filter((docente) => !docentesContados[docente.nome]);
                
                docentesNaoContados.forEach((docente) => {
                  if (departamentos.indexOf(docente.Departamento) === -1) {
                    departamentos.push(docente.Departamento);
                  }

                  const departamentoIndex = managerFromDepartaments.findIndex((d) => d[0] === docente.Departamento);

                  if (departamentoIndex >= 0) {
                    managerFromDepartaments[departamentoIndex][1] += 1;
                  } else {
                    managerFromDepartaments.push([docente.Departamento, 1]);
                  }

                  docentesContados[docente.nome] = true;
                });

                totalManager += docentesNaoContados.length;
              });

              departamentos.sort();

              return {
                departamentos,
                totalManager,
                managerFromDepartaments,
                years: [...years],
                yearsDocentes,
                docentesContados,
              };
            },
            {
              departamentos: [],
              totalManager: 0,
              managerFromDepartaments: [],
              years: [],
              yearsDocentes: [],
              docentesContados: {},
            }
          );

          result.managerFromDepartaments.unshift([
            "Departamento",
            "Quantidade",
          ]);

          result.yearsDocentes.unshift(["Ano", "Total"]);

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

  async getDocentesByYear(req, res) {
    const year = req.params.year;

    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);

          const filteredData = docentesData.filter((data) =>
            data[0].codigo.includes(`-${year}`)
          );

          // Processa os dados utilizando o método reduce
          const result = filteredData[0].reduce(
            (acc, docente) => {
              const departamentos = acc.departamentos;
              let totalManager = acc.totalManager;
              const managerFromDepartaments = acc.managerFromDepartaments;

              docente.docentes.forEach((element) => {
                // Popula o array de departamentos
                if (departamentos.indexOf(element.Departamento) === -1) {
                  departamentos.push(element.Departamento);
                }
                // Calcula o total de docentes por departamento
                const departamentoIndex = managerFromDepartaments.findIndex(
                  (d) => d[0] === element.Departamento
                );
                if (departamentoIndex === -1) {
                  managerFromDepartaments.push([element.Departamento, 1]);
                } else {
                  managerFromDepartaments[departamentoIndex][1] += 1;
                }
              });

              // Calcula o total de docentes
              totalManager += docente.docentes.length;

              departamentos.sort();
              return { departamentos, totalManager, managerFromDepartaments };
            },
            { departamentos: [], totalManager: 0, managerFromDepartaments: [] }
          );

          result.managerFromDepartaments.unshift([
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

  async getDocentesLista(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const result = JSON.parse(data);
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
        const paginatedData = data[0].slice(startIndex, endIndex); // data[0] retorna apenas os de 2020, ajustar depois
        res.json(paginatedData);
      }
    });
  }

  async getDepartamentInYears(req, res) {

    const departament = req.body.personName

    
    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);

          let firstArrayDep = []

          firstArrayDep.push('Ano')

          departament.forEach((dep) =>{
            firstArrayDep.push(dep)
          })

          // Processa os dados utilizando o método reduce
          const result = docentesData.reduce((acc, docente) => {
            const departamentYears = acc.departamentYears || [];
            const newDepartamentYears = acc.newDepartamentYears || [];

            docente.forEach((member) => {
              const year = parseInt(member.codigo.split("-")[1]);

              member.docentes.forEach((element) => {
                departament.forEach((dep) => {
                  if (element.Departamento === dep) {

                    const index = departamentYears.findIndex((el) => el[0] === year);
                    const indexYear = newDepartamentYears.findIndex((el) => el[0] === year);
                    const indexDep = firstArrayDep.findIndex((el) => el === dep);

                    if (departamentYears.length) {
                      if (index === -1) {
                        departamentYears.push([year, 1]);
                      } else {
                        departamentYears[index][1] += 1;
                      }
                    } else {
                      departamentYears.push([year, 1]);
                    }

                    if(newDepartamentYears.length){
                      if(indexYear === -1){
                        newDepartamentYears.push([year, 1]);
                      }
                      else {
                        if(!newDepartamentYears[indexYear][indexDep]){
                          newDepartamentYears[indexYear][indexDep] = 1
                        }else {
                          newDepartamentYears[indexYear][indexDep] += 1;
                        }
                      }
                    }else {
                      newDepartamentYears.push([year, 1]);
                    }
                  }
                })

              });
            });
            console.log(newDepartamentYears)

            return {departamentYears, newDepartamentYears};
          }, {departamentYears: [], newDepartamentYears: []});
          

        // Processa os dados utilizando o método reduce
        const resultTeste = docentesData.reduce((acc, docente) => {
          const yearDepartmentCounts = acc.yearDepartmentCounts || {};

          docente.forEach((member) => {
            const year = parseInt(member.codigo.split("-")[1]);

            member.docentes.forEach((element) => {
              const department = element.Departamento;
              if (firstArrayDep.includes(department)) {
                yearDepartmentCounts[year] = yearDepartmentCounts[year] || {};
                yearDepartmentCounts[year][department] = yearDepartmentCounts[year][department] || 0;
                yearDepartmentCounts[year][department] += 1;
              }
            });
          });

          return {yearDepartmentCounts};
        }, {yearDepartmentCounts: {}});

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
          arr.splice(1, 1)
        })
        console.log(matrixData);
          
          callback(null, {result, matrixData});
        } catch (err) {
          console.log(err)
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

module.exports = new UserController();
