const path = require('path');
const fs = require('fs');

const FILE = path.join(__dirname, '../files/projetos.json');

class GeneralController {
  async getGeneralMetrics(req, res) {
    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const docentesData = JSON.parse(data);
          // Processa os dados utilizando o método reduce
          const result = docentesData.reduce(
            (acc, current) => {
              let totalManager = acc.totalManager;
              let totalDiscentes = acc.totalDiscentes;
              let totalExterno = acc.totalExterno;
              let departamentos = [];
              let qntd_departamento = 0;
              let totalProjetos = acc.totalProjetos;
              let totalConcluidos = acc.totalConcluidos;
              const yearsProject = acc.yearsProject;

              // Adiciona o ano à lista de anos encontrados
              current.forEach((projeto) => {
                const year = parseInt(projeto.codigo.split('-')[1]);

                // Verifica se o ano já está presente no objeto de resultados
                const index = yearsProject.findIndex(
                  (item) => item[0] === year
                );
                if (index === -1) {
                  yearsProject.push([year, 1]);
                } else {
                  yearsProject[index][1] += 1;
                }

                // Calcula o total de docentes do projeto
                totalManager += projeto.qntd_docente;
                totalDiscentes += projeto.qntd_discente;
                totalExterno += projeto.qntd_externo;
                if (projeto.situacao === 'CONCLUÍDA') {
                  totalConcluidos += 1;
                }
                projeto.docentes.forEach((docente) => {
                  // Popula o array de departamentos
                  if (departamentos.indexOf(docente.Departamento) === -1) {
                    departamentos.push(docente.Departamento);
                  }
                });
                totalProjetos += 1;
              });

              qntd_departamento = departamentos.length;

              return {
                totalManager,
                totalDiscentes,
                totalExterno,
                qntd_departamento,
                totalProjetos,
                totalConcluidos,
                yearsProject,
              };
            },
            {
              totalManager: 0,
              totalDiscentes: 0,
              totalExterno: 0,
              qntd_departamento: 0,
              totalProjetos: 0,
              totalConcluidos: 0,
              yearsProject: [],
            }
          );
          result.yearsProject.unshift(['Ano', 'Total']);

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

  async getGeneralMetricsByDepartament(req, res) {
    function readJson(path, callback) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const departamentsBody = req.body;

          const docentesData = JSON.parse(data);
          // Processa os dados utilizando o método reduce
          const result = docentesData.reduce(
            (acc, current) => {
              let totalManager = acc.totalManager;
              let totalDiscentes = acc.totalDiscentes;
              let totalExterno = acc.totalExterno;
              let qntd_departamento = 1;
              let totalProjetos = acc.totalProjetos;
              let totalConcluidos = acc.totalConcluidos;
              const yearsProject = acc.yearsProject;

              // Adiciona o ano à lista de anos encontrados
              current.forEach((projeto) => {
                //let departametToFilter = projeto.docentes.find((doc) => doc.Funcao === "COORDENADOR(A) GERAL" && doc.Departamento === departamentsBody[0])

                const year = parseInt(projeto.codigo.split('-')[1]);
                if (year.toString() === departamentsBody[1] || !departamentsBody[1]) {
                  // Calcula o total de docentes do departamento
                  projeto.docentes.map((docent) => {
                    if (docent.Departamento === departamentsBody[0]) {
                      totalManager += 1;
                    }
                  });

                  // Calcula o total de discentes do departamento
                  projeto.discente.map((discent) => {
                    if (discent.Departamento === departamentsBody[0]) {
                      totalDiscentes += 1;
                    }
                  });

                  // Calcula o total de externos do departamento
                  projeto.externo_equipe.map((discent) => {
                    if (discent.Departamento === departamentsBody[0]) {
                      totalExterno += 1;
                    }
                  });

                  if (
                    projeto.docentes.find(
                      (docent) =>
                        docent.Departamento === departamentsBody[0] &&
                        docent.Funcao === 'COORDENADOR(A) GERAL'
                    )
                  ) {
                    totalProjetos += 1;
                    if (projeto.situacao === 'CONCLUÍDA') {
                      totalConcluidos += 1;
                    }

                    // Verifica se o ano já está presente no objeto de resultados
                    const index = yearsProject.findIndex(
                      (item) => item[0] === year
                    );
                    if (index === -1) {
                      yearsProject.push([year, 1]);
                    } else {
                      yearsProject[index][1] += 1;
                    }
                  }
                }
              });

              return {
                totalManager,
                totalDiscentes,
                totalExterno,
                qntd_departamento,
                totalProjetos,
                totalConcluidos,
                yearsProject,
              };
            },
            {
              totalManager: 0,
              totalDiscentes: 0,
              totalExterno: 0,
              qntd_departamento: 1,
              totalProjetos: 0,
              totalConcluidos: 0,
              yearsProject: [],
            }
          );
          result.yearsProject.unshift(['Ano', 'Total']);

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
}

module.exports = new GeneralController();
