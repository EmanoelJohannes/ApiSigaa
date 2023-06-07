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

          let resultTipoFinanciamento = [
            ['FINANCIAMENTO INTERNO', 0],
            ['AÇÃO AUTO-FINANCIADA', 0],
            ['FINANCIAMENTO EXTERNO', 0],
          ];

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
              let tiposFinanciamentos = acc.tiposFinanciamentos;
              let estimadoInterno = acc.estimadoInterno;
              let estimadoExterno = acc.estimadoExterno;
              let atingido = acc.atingido;

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

                  let estimado_interno = projeto.estimado_interno;
                  let estimado_externo = projeto.estimado_externo;

                  estimado_interno = parseInt(
                    estimado_interno.replace(/[^0-9]/g, '')
                  );
                  estimado_externo = parseInt(
                    estimado_externo.replace(/[^0-9]/g, '')
                  );

                  if (!estimado_interno) {
                    estimado_interno = 0;
                  }

                  if (!estimado_externo) {
                    estimado_externo = 0;
                  }

                  estimadoInterno += estimado_interno;
                  estimadoExterno += estimado_externo;
                  atingido += projeto.publico_atingido;
                }
                projeto.docentes.forEach((docente) => {
                  // Popula o array de departamentos
                  if (departamentos.indexOf(docente.Departamento) === -1) {
                    departamentos.push(docente.Departamento);
                  }
                });

                if (tiposFinanciamentos.length) {
                  let indexElement = -1;

                  tiposFinanciamentos.map((tipo, index) => {
                    if (tipo[0] === projeto.tipo_financiamento) {
                      indexElement = index;
                    }
                  });

                  if (indexElement > -1) {
                    tiposFinanciamentos[indexElement][1] += 1;
                  } else {
                    tiposFinanciamentos.push([projeto.tipo_financiamento, 1]);
                  }
                } else {
                  tiposFinanciamentos.push([projeto.tipo_financiamento, 1]);
                }
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
                tiposFinanciamentos,
                estimadoExterno,
                estimadoInterno,
                atingido,
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
              tiposFinanciamentos: [],
              estimadoExterno: 0,
              estimadoInterno: 0,
              atingido: 0,
            }
          );
          result.yearsProject.unshift(['Ano', 'Total']);

          result.tiposFinanciamentos.map((tipo) => {
            resultTipoFinanciamento.map((result) => {
              if (tipo[0].indexOf(result[0]) > -1) {
                result[1] += tipo[1];
              }
            });
          });

          resultTipoFinanciamento.unshift(['Tipo', 'Total']);
          result.tiposFinanciamentos = resultTipoFinanciamento;

          callback(null, result);
        } catch (err) {
          console.log(err);
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

          let resultTipoFinanciamento = [
            ['FINANCIAMENTO INTERNO', 0],
            ['AÇÃO AUTO-FINANCIADA', 0],
            ['FINANCIAMENTO EXTERNO', 0],
          ];

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
              let tiposFinanciamentos = acc.tiposFinanciamentos || [];
              let estimadoInterno = acc.estimadoInterno;
              let estimadoExterno = acc.estimadoExterno;
              let atingido = acc.atingido;

              current.forEach((projeto) => {
                //let departametToFilter = projeto.docentes.find((doc) => doc.Funcao === "COORDENADOR(A) GERAL" && doc.Departamento === departamentsBody[0])

                const year = parseInt(projeto.codigo.split('-')[1]);
                if (
                  year.toString() === departamentsBody[1] ||
                  !departamentsBody[1]
                ) {
                  departamentsBody[0].map((compareDep) => {
                    projeto.docentes.map((docent) => {
                      //METRICA DE TOTAL DE DOCENTE/DISCENTE/EXTERNO
                      if (docent.Departamento === compareDep) {
                        totalManager += 1;
                      }
                    });

                    projeto.discente.map((discent) => {
                      if (discent.Departamento === compareDep) {
                        totalDiscentes += 1;
                      }
                    });

                    projeto.externo_equipe.map((discent) => {
                      if (discent.Departamento === compareDep) {
                        totalExterno += 1;
                      }
                    });

                    if (
                      projeto.docentes.find(
                        (docent) =>
                          docent.Departamento === compareDep &&
                          docent.Funcao === 'COORDENADOR(A) GERAL'
                      )
                    ) {
                      totalProjetos += 1;
                      // METRICA DE CONCLUIDOS
                      if (projeto.situacao === 'CONCLUÍDA') {
                        totalConcluidos += 1;
                        let estimado_interno = projeto.estimado_interno;
                        let estimado_externo = projeto.estimado_externo;

                        estimado_interno = parseInt(
                          estimado_interno.replace(/[^0-9]/g, '')
                        );
                        estimado_externo = parseInt(
                          estimado_externo.replace(/[^0-9]/g, '')
                        );

                        if (!estimado_interno) {
                          estimado_interno = 0;
                        }

                        if (!estimado_externo) {
                          estimado_externo = 0;
                        }

                        estimadoInterno += estimado_interno;
                        estimadoExterno += estimado_externo;
                        atingido += projeto.publico_atingido;
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

                      // METRICA DE FINANCIAMENTO
                      if (tiposFinanciamentos.length > 0) {
                        let indexElement = -1;

                        tiposFinanciamentos.map((tipo, index) => {
                          if (tipo[0] === projeto.tipo_financiamento) {
                            indexElement = index;
                          }
                        });

                        if (indexElement > -1) {
                          tiposFinanciamentos[indexElement][1] += 1;
                        } else {
                          tiposFinanciamentos.push([
                            projeto.tipo_financiamento,
                            1,
                          ]);
                        }
                      } else {
                        tiposFinanciamentos.push([
                          projeto.tipo_financiamento,
                          1,
                        ]);
                      }
                    }
                  });
                }
                if(departamentsBody[0].length > 1){
                  qntd_departamento = departamentsBody[0].length
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
                tiposFinanciamentos,
                estimadoExterno,
                estimadoInterno,
                atingido,
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
              tiposFinanciamentos: [],
              estimadoExterno: 0,
              estimadoInterno: 0,
              atingido: 0,
            }
          );
          result.yearsProject.unshift(['Ano', 'Total']);

          result.tiposFinanciamentos.map((tipo) => {
            resultTipoFinanciamento.map((result) => {
              if (tipo[0].indexOf(result[0]) > -1) {
                result[1] += tipo[1];
              }
            });
          });

          resultTipoFinanciamento.unshift(['Tipo', 'Total']);
          result.tiposFinanciamentos = resultTipoFinanciamento;

          callback(null, result);
        } catch (err) {
          console.log(err);
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
