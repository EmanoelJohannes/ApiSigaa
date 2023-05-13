const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

class MetricsController {
  async getMetrics(req, res) {
    let file = path.join(__dirname, "../files/projetos.json");
    function readJson(path, callback) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.log(err);
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

          callback(null, resultTipoFinanciamento);
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

module.exports = new MetricsController();
