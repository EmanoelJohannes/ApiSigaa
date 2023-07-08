const path = require("path");
const fs = require("fs");

class MetricsController {
  async getMetrics(req, res) {
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
          const discentesData = JSON.parse(data);

          let resultTipoFinanciamento = [
            [ 'FINANCIAMENTO INTERNO', 0 ],
            [ 'AÇÃO AUTO-FINANCIADA', 0 ],
            [ 'FINANCIAMENTO EXTERNO', 0 ]
          ]

          const result = discentesData.reduce(
            (acc, projects) => {
              let tiposFinanciamentos = acc.tiposFinanciamentos;
              projects.map((project) => {
                
                if(tiposFinanciamentos.length){
                    let indexElement = -1

                    tiposFinanciamentos.map((tipo, index) => {
                        if(tipo[0] === project.tipo_financiamento){
                            indexElement = index
                        }
                    })

                    if (indexElement > -1) {
                      tiposFinanciamentos[indexElement][1] += 1;
                    } else {
                      tiposFinanciamentos.push([project.tipo_financiamento, 1]);
                    }
                }else {
                    tiposFinanciamentos.push([project.tipo_financiamento, 1]);
                }
              });

              return {
                tiposFinanciamentos,
              };
            },
            {
              tiposFinanciamentos: [],
            }
          );
          
          
          result.tiposFinanciamentos.map((tipo) => {
            resultTipoFinanciamento.map((result) => {
              if(tipo[0].indexOf(result[0]) > -1){
                result[1] += tipo[1]
              }
            })
          })


          resultTipoFinanciamento.unshift(["Tipo", "Total"]);

          callback(null, {resultTipoFinanciamento});
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


  async getPublicMetric(req, res) {
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
          const discentesData = JSON.parse(data);

          const result = discentesData.reduce(
            (acc, projects) => {
              let estimadoInterno = acc.estimadoInterno;
              let estimadoExterno = acc.estimadoExterno;
              let atingido = acc.atingido;

              projects.map((project) => {
                if(project.situacao === 'CONCLUÍDA'){
                  let estimado_interno = project.estimado_interno
                  let estimado_externo = project.estimado_externo

                  estimado_interno = parseInt(estimado_interno.replace(/[^0-9]/g,''));
                  estimado_externo = parseInt(estimado_externo.replace(/[^0-9]/g,''));

                  if(!estimado_interno){
                    estimado_interno = 0
                  }

                  if(!estimado_externo){
                    estimado_externo = 0
                  }

                  estimadoInterno += estimado_interno
                  estimadoExterno += estimado_externo
                  atingido += project.publico_atingido

                }

              });

              return {
                estimadoExterno, estimadoInterno, atingido,
              };
            },
            {
              estimadoExterno: 0, estimadoInterno: 0, atingido: 0
            }
          );

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


  async getPublicMetricByYear(req, res) {
    
    let fileRead = req.query.type
    if(!fileRead){
      fileRead = 'projetos'
    }
    const FILE = path.join(__dirname, `../files/${fileRead}.json`);

    const year = req.params.year;

    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return callback(err);
        }
        try {
          const discentesData = JSON.parse(data);

          const filteredData = discentesData.filter(data => data[0].codigo.includes(`-${year}`));

          const result = filteredData.reduce(
            (acc, projects) => {
              let estimadoInterno = acc.estimadoInterno;
              let estimadoExterno = acc.estimadoExterno;
              let atingido = acc.atingido;

              projects.map((project) => {
                if(project.situacao === 'CONCLUÍDA'){
                  let estimado_interno = project.estimado_interno
                  let estimado_externo = project.estimado_externo

                  estimado_interno = parseInt(estimado_interno.replace(/[^0-9]/g,''));
                  estimado_externo = parseInt(estimado_externo.replace(/[^0-9]/g,''));

                  if(!estimado_interno){
                    estimado_interno = 0
                  }

                  if(!estimado_externo){
                    estimado_externo = 0
                  }

                  estimadoInterno += estimado_interno
                  estimadoExterno += estimado_externo
                  atingido += project.publico_atingido

                }

              });

              return {
                estimadoExterno, estimadoInterno, atingido,
              };
            },
            {
              estimadoExterno: 0, estimadoInterno: 0, atingido: 0
            }
          );

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

module.exports = new MetricsController();
