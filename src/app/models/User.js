var db = require("../../config/dbConnection");
const crypto = require('crypto');
const { orWhere } = require("../../config/dbConnection");

class UserModel {

  async getUsers() {
    var result;

    await db("usuario")
      .select("usuario.nmusuario", "usuario.nucpf", "usuario.nmlogin", "perfil.codigo as idperfil")
      .join("perfil", "perfil.id", "=", "usuario.cod_perfil")
      .orderBy("usuario.nmusuario")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUsers Model => ", erro);
        return;
      });

    return result;
  }

  async getUserCPF(nucpf) {
    var result;

    await db("usuario")
      .select("*")
      .where({
        "usuario.nucpf": nucpf
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUserCPF Model => ", erro);
        return;
      });

    return result;
  }

  async deleteUser(cpf) {
    var result;

    await db("usuario")
      .where("nucpf", "=", cpf)
      .del()
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUsers Model => ", erro);
        return;
      });

    return result;
  }

  async storeUser(data) {
    var result;

    await db("usuario")
      .insert(data)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeUser Model => ", erro);
        return;
      });

    return result;
  }

  async Autenticate(nmlogin, dssenha) {
    var result;

    dssenha = crypto.createHash('md5').update(dssenha).digest('hex')

    await db("usuario")
      .select('usuario.*', 'perfil.codigo as idperfil', 'perfil.nome as perfilNome')
      .join('perfil', 'usuario.cod_perfil', '=', 'perfil.id')
      .where({
        nmlogin: nmlogin,
        dssenha: dssenha
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro Autenticate Model => ", erro);
        return;
      });

    return result;
  }

  async AutenticateEntrarComo(nmlogin) {
    var result;


    await db("usuario")
      .select('usuario.*', 'perfil.codigo as idperfil', 'perfil.nome as perfilNome')
      .join('perfil', 'usuario.cod_perfil', '=', 'perfil.id')      .where({
        nmlogin: nmlogin
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro AutenticateEntrarComo Model => ", erro);
        return;
      });

    return result;
  }

  async AutenticateByCPF(nucpf, dssenha) {
    var result;

    dssenha = crypto.createHash('md5').update(dssenha).digest('hex')

    await db("usuario")
      .select('usuario.*', 'perfil.codigo as idperfil', 'perfil.nome as perfilNome')
      .join('perfil', 'usuario.cod_perfil', '=', 'perfil.id')      .where({
        nucpf: nucpf,
        dssenha: dssenha
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro Autenticate Model => ", erro);
        return;
      });

    return result;
  }

  async AutenticateByEmail(dsemail, dssenha) {
    var result;

    dssenha = crypto.createHash('md5').update(dssenha).digest('hex')

    await db("usuario")
      .select('usuario.*', 'perfil.codigo as idperfil', 'perfil.nome as perfilNome')
      .join('perfil', 'usuario.cod_perfil', '=', 'perfil.id')      .where({
        dsemail: dsemail,
        dssenha: dssenha
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro Autenticate Model => ", erro);
        return;
      });

    return result;
  }

  async storeAccess(data) {
    var result;

    await db("registro_acesso")
      .insert(data)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeAccess Model => ", erro);
        return;
      });

    return result;
  }

  async checkHourStore(nucpf) {
    var result;

    await db("registro_acesso")
      .select('*')
      .where({nucpf})
      .orderBy('idregistro', 'desc')
      .limit(1)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeAccess Model => ", erro);
        return;
      });

    return result;
  }

  async findByEmail(dsemail) {
    var result;

    await db("usuario")
      .select('*')
      .where({
        dsemail
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro findByEmail Model => ", erro);
        return;
      });

    return result;
  }

  async findByLogin(nmlogin) {
    var result;

    await db("usuario")
      .select('*')
      .where({
        nmlogin
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro findByLogin Model => ", erro);
        return;
      });

    return result;
  }

  async findByCPF(nucpf) {
    var result;

    await db("usuario")
      .select('*')
      .where({
        nucpf
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro findByCPF Model => ", erro);
        return;
      });

    return result;
  }

  async findByHash(hash) {
    var result;

    await db("trocasenha")
      .select('login')
      .where({
        ticket: hash
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro findByCPF Model => ", erro);
        return;
      });

    return result;
  }

  async updateUser(nucpf, data) {

    var result;

    await db("usuario")
      .select('*')
      .update(
        data
      )
      .where({ nucpf })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro updateUser Model => ", erro);
        return;
      });

    return result;
  }

  async updatePassword(nucpf, newSenha) {

    var result;

    newSenha = crypto.createHash('md5').update(newSenha).digest('hex');

    await db("usuario")
      .select('*')
      .update({
        dssenha: newSenha
      })
      .where({ nucpf })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro updatePassword Model => ", erro);
        return;
      });

    return result;
  }


  async getUfs() {
    var result;

    await db("cidade")
      .select("iduf as uf")
      .distinct()
      .orderBy('cidade.iduf')
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUfs Model => ", erro);
        return;
      });

    return result;
  }

  async getUfByCity(idcidade) {
    var result;

    await db("cidade")
      .select("iduf")
      .where("idcidade", "=", idcidade)
      .distinct()
      .orderBy('cidade.iduf')
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUfByCity Model => ", erro);
        return;
      });

    return result;
  }

  async getCities(uf) {
    var result;

    await db("cidade")
      .select("nmcidade as cidade")
      .select("idcidade")
      .where({
        iduf: uf
      })
      .orderBy('cidade')
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getCities Model => ", erro);
        return;
      });

    return result;
  }


  async getAllCities() {
    var result;

    await db("cidade")
      .select("*")
      // .where({dados_correios: false})
      .where({cidade_atualizada: false})
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getAllCities Model => ", erro);
        return;
      });

    return result;
  }

  async storeCityAux(cidade_aux, idcidade) {
    var result;
    
    await db("cidade")
      .update({cidade_aux: cidade_aux})
      .where({
        idcidade: idcidade
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeCityAux Model =>", erro);
        return;
      });

    return result;
  }

  async storeCityTempToNmcidade(cidade_temp, idcidade) {
    var result;
    
    await db("cidade")
      .update({nmcidade: cidade_temp, cidade_atualizada: true})
      .where({
        idcidade: idcidade
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeCityTempToNmcidade Model =>", erro);
        return;
      });

    return result;
  }

  async storeNewCityName(cidade_temp, idceplocal) {
    var result;
    
    await db("cidade")
      .update({cidade_temp: cidade_temp, dados_correios: true})
      .where({
        idceplocal: idceplocal
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeNewCityName Model =>", erro);
        return;
      });

    return result;
  }

  async changePasswordRequest(data) {
    var result;

    await db("trocasenha")
      .insert(data)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro changePasswordRequest Model => ", erro);
        return;
      });

    return result;

  }
  async updateChangePasswordRequest(hash) {

    var result;

    await db("trocasenha")
      .update({ dtuso: new Date(), flusado: 's' })
      .where({ ticket: hash })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro UpdateChangePasswordRequest Model => ", erro);
        return;
      });

    return result;
  }

  async changePassword(nmlogin, newSenha) {
    var result;

    newSenha = crypto.createHash('md5').update(newSenha).digest('hex');

    await db("usuario")
      .update({ dssenha: newSenha })
      .where({ nmlogin })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro changePassword Model => ", erro);
        return;
      });

    return result;
  }

  async getEndereco(idcep) {
    var result;
    
    await db("cep")
      .select("*")
      .where("cep.id_cep", '=', idcep)
      .join('cidade', 'cep.id_cidade', '=', 'cidade.idcidade')
      .join('bairro', 'cep.id_bairro', '=', 'bairro.idbairro')
      .join('uf', 'cidade.iduf', '=', 'uf.iduf')
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getEndereco Model => ", erro);
        return;
      });

    return result;
  }


  // async checkMessage(nucpf){
  //   var result;

  //   await db("comunicados")
  //     .select("*")
  //     .whereNotExists(function() {
  //       this.select('*').from('usuarios_comunicados').whereRaw(`usuarios_comunicados.id_comunicado = comunicados.id and usuarios_comunicados.nucpf = '${nucpf}'`);
  //     })
  //     .leftJoin('meios_comunicados', 'meios_comunicados.id_meio', '=', 'comunicados.id_meio')
  //     .orderBy("comunicados.dtemail", "desc")
  //     .then(response => {
  //       result = response;
  //     })
  //     .catch(erro => {
  //       console.log("Erro checkMessage Model => ", erro);
  //       return;
  //   });

  //   return result;
  // }

  async getUsuariosComunicados(){
    var result;

    await db("usuarios_comunicados")
      .select("*")
      .join('comunicados', 'comunicados.id', '=', 'usuarios_comunicados.id_comunicado')
      .join('meios_comunicados', 'meios_comunicados.id_meio', '=', 'comunicados.id_meio')
      // .leftJoin('reuniao', function() {
      //   this.on('comunicados.id_remetente', '=', 'reuniao.idreuniao')
      // })
      .orderBy("comunicados.dtemail", "desc")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUsuariosComunicadosNaoLidas Model => ", erro);
        return;
    });

    return result;
  }

  async getUsuariosComunicadosNaoLidas(){
    var result;

    await db("usuarios_comunicados")
      .select("*")
      .where({lido: '0'})
      .join('comunicados', 'comunicados.id', '=', 'usuarios_comunicados.id_comunicado')
      .join('meios_comunicados', 'meios_comunicados.id_meio', '=', 'comunicados.id_meio')
      .orderBy("comunicados.dtemail", "desc")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getUsuariosComunicadosNaoLidas Model => ", erro);
        return;
    });

    return result;
  }

  async getNotifications(){
    var result;

    await db("comunicados")
      .select("*")
      .orderBy("comunicados.dtemail", "desc")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getNotifications Model => ", erro);
        return;
    });

    return result;
  }

  async getReadMessage(identidade, id_comunicado){
    var result;
    
    await db("usuarios_comunicados")
      .select("*")
      .where({
        identidade: identidade,
        id_comunicado: id_comunicado,
        lido: '1'
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getReadMessage Model => ", erro);
        return;
    });

    return result;
  }
  
  async updateReadMessage(identidade, id_comunicado){
    var result;

    console.log(identidade, id_comunicado);
    
    await db("usuarios_comunicados")
      .update({
        meiovisualizacao: "app",
        lido: '1'
      })
      .where({
        identidade: identidade,
        id_comunicado: id_comunicado
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro updateReadMessage Model => ", erro);
        return;
    });

    return result;
  }


  async getRecursosByPerfil(cod_perfil){
    var result;

    await db("perfil_recurso")
      .select("nmrecurso")
      .join('recurso', 'perfil_recurso.idrecurso', '=', 'recurso.idrecurso')
      .where('cod_perfil', '=', cod_perfil)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getRecursosByPerfil Model => ", erro);
        return;
    });

    return result;
  }

  async getRecursosByUsuario(nucpf){
    var result;

    await db("usuario_recurso")
      .select("nmrecurso")
      .join('recurso', 'usuario_recurso.idrecurso', '=', 'recurso.idrecurso')
      .where('usuario_recurso.nucpf', '=', nucpf)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getRecursosByUsuario Model => ", erro);
        return;
    });

    return result;
  }













  

  // ************ Tabelas relacionadas à criação de empresário **************

  async checkUniqueCNPJ(cnpj) {
    var result;

    await db("empresa")
      .select('*')
      .where({ nucnpjcpf: cnpj })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro checkUniqueCNPJ Model => ", erro);
        return;
      });

    return result;
  }

  async getEmpresaWithPresident(cnpj) {
    var result;

    await db("contato")
      .select("contato.*", "empresa.nurazaosocial", "empresa.nmfantasia", "empresa.idempresa", "contato.identidade", "nucnpjcpf", "empresa.idcidade", "cidade.iduf", "cidade.nmcidade")
      .join("empresa", "empresa.idempresa", "=", "contato.identidade")
      .join("cidade", "empresa.idcidade", "=", "cidade.idcidade")
      .where('empresa.nucnpjcpf', '=', cnpj)
      .distinct("empresa.idempresa")

      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getEmpresaWithPresident Model => ", erro);
        return;
      });

    return result;
  }

  async getContato(cnpj) {
    var result;

    await db("contato")
      .select("contato.*")
      .join("empresa", "empresa.idempresa", "=", "contato.identidade")
      .where('empresa.nucnpjcpf', '=', cnpj)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getContato Model => ", erro);
        return;
      });

    return result;
  }

  async checkNucleoEmpresa(idEmpresa) {
    var result;

    await db("nucemp")
      .select(
        "cidade.iduf",
        "cidade.nmcidade",
        "cidade.idcidade",
        "nucleo.*"
      )
      .join("nucleo", "nucemp.idnucleo", "=", "nucleo.idnucleo")
      .where("nucemp.idempresa", "=", idEmpresa)
      .join("associacao", "nucleo.idassociacao", "=", "associacao.idassociacao")
      .join("cidade", "associacao.idcidade", "=", "cidade.idcidade")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro checkNucleoEmpresa Model => ", erro);
        return;
      });

    return result;
  }

  async getCnpjInEmpresas(nucpf) {
    var result;
    
    await db("usuario")
      .select("empresa.*", "usuario.nucpf")
      .join('contato', 'contato.nucpf', '=', 'usuario.nucpf')
      .join('empresa', function() {
        this.on('empresa.idgestorempresa', '=', 'usuario.nucpf').orOn('empresa.idempresa', '=', 'contato.identidade ')
      })
      .where("usuario.nucpf", '=', nucpf)
      .andWhere('contato.idtipoentidade', '=', 'EMP')
      .distinct("empresa.idempresa")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getCnpjInEmpresas Model => ", erro);
        return;
      });

    return result;
  }

  async getEmpresaInContatos(nucpf) {
    var result;
    
    await db("usuario")
      .select("empresa.nucnpjcpf", "usuario.nucpf", "contato.identidade")
      .join("contato", "contato.nucpf", "=", "usuario.nucpf")
      .where("contato.idtipoentidade", '=', 'EMP')
      .join("empresa", 'contato.identidade', '=', 'empresa.idempresa')
      .where("usuario.nucpf", '=', nucpf)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getEmpresaInContatos Model => ", erro);
        return;
      });

    return result;
  }

  async storeCPFContatoEmpresario(nucpf, identidade) {
    var result;

    await db("contato")
      .update("nucpf", nucpf)
      .where("identidade", "=", identidade)
      .andWhere("idtipoentidade", "=", "EMP")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeCPFContatoEmpresario Model => ", erro);
        return;
      });

    return result;
  }

  async storeCPFContatoFederacao(nucpf, identidade) {
    var result;

    await db("contato")
      .update("nucpf", nucpf)
      .where("identidade", "=", identidade)
      .andWhere("idtipoentidade", "=", "FED")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeCPFContatoFederacao Model => ", erro);
        return;
      });

    return result;
  }

  async storeCPFContatoAssociacao(nucpf, identidade) {
    var result;

    await db("contato")
      .update("nucpf", nucpf)
      .where("identidade", "=", identidade)
      .andWhere("idtipoentidade", "=", "ACE")
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro storeCPFContatoAssociacao Model => ", erro);
        return;
      });

    return result;
  }

  async checkDirigenteFederacaoInfos(id){
    var result;

    await db("contato")
      .select("contato.*", "cidade.iduf", "cidade.idcidade")
      .where('contato.identidade', '=', id)
      .join('federacao', 'federacao.idfederacao', '=', 'contato.identidade')
      .join('cidade', 'federacao.idcidade', '=', 'cidade.idcidade')
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro checkDirigenteInfos Model => ", erro);
        return;
      });

    return result;
  }

  async checkDirigenteAssociacaoInfos(id){
    var result;

    await db("contato")
      .select("contato.*", "cidade.iduf", "cidade.idcidade")
      .join('associacao', 'associacao.idassociacao', '=', 'contato.identidade')
      .where('associacao.idassociacao', '=', id)
      .andWhere('contato.idtipoentidade', '=', 'ACE')
      .join('cidade', 'associacao.idcidade', '=', 'cidade.idcidade')
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro checkDirigenteAssociacaoInfos Model => ", erro);
        return;
      });

    return result;
  }


  async getCarousel(){
    var result;

    await db("carousel")
      .select("carousel.*", "anexo.nome_arquivo", "anexo.id")
      .join('anexo', 'anexo.id', '=', 'carousel.id_anexo')
      .where('carousel.tipo', '=', 'imagem')
      .andWhere('carousel.status_carousel', '=', '1')
      .andWhere(function() {
        this.where('carousel.meio', '=', 'app').orWhere('carousel.meio', '=', 'app_portal')
      })
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getCarousel Model => ", erro);
        return;
      });

    return result;
  }


  async getContatos() {
    var result;

    await db("contato")
      .select("contato.*", "empresa.idempresa", "empresa.flativo as empresaAtiva", "empresa.dsemail as emailEmpresa")
      .join("empresa", "empresa.idempresa", "=", "contato.identidade")
      .where('contato.idtipoentidade', '=', 'EMP')
      .andWhere('contato.verificado', '=', false)
      .andWhere('empresa.flativo', '=', 'S')
      .whereNull('contato.dsemail')
      .whereNotNull('contato.nmcontato')
      .whereNotNull('empresa.dsemail')
      .limit(5000)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro getContatos Model => ", erro);
        return;
      });

    return result;
  }


  async updateEmailEmpresaParaContato(idcontato, emailEmpresa) {
    var result;

    await db("contato")
      .update({
        verificado: true,
        email_empresa: true,
        dsemail: emailEmpresa
      })
      .where("contato.idcontato", "=", idcontato)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro updateEmailEmpresaParaContato Model => ", erro);
        return;
      });

    return result;
  }

  async updateVerificado(idcontato) {
    var result;

    await db("contato")
      .update({
        verificado: true,
      })
      .where("contato.idcontato", "=", idcontato)
      .then(response => {
        result = response;
      })
      .catch(erro => {
        console.log("Erro updateVerificado Model => ", erro);
        return;
    });

    return result;
  }

}

module.exports = new UserModel();
