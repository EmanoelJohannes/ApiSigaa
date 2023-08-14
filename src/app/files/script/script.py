from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd
import re
import json
import time
from selenium.webdriver.chrome.service import Service

class ColectMetricProjectsOtimized:
    def __init__(self):
        self.driver = None

    def initialize_driver(self):
        options = webdriver.ChromeOptions()
        options.add_argument("window-size=1500,800")
        prefs = {"profile.managed_default_content_settings.images": 2}
        options.add_experimental_option("prefs", prefs)
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                             "(KHTML, like Gecko) Chrome/90.0.4412.3 Safari/537.36")
        #self.driver = webdriver.Chrome(ChromeDriverManager().install())
        #self.driver = webdriver.Chrome(ChromeDriverManager(version="115.0.5790.171").install())
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager(version='114.0.5735.90').install()))

    def login(self):
        self.driver.get(f'https://sigaa.unb.br/sigaa/verTelaLogin.do')
        user_input = self.driver.find_element(By.NAME, 'username')
        pass_input = self.driver.find_element(By.NAME, 'password')

        # Matricula da conta aqui
        user_input.send_keys("170140997")

        # Senha da conta aqui
        pass_input.send_keys("Dia1406199")
        pass_input.send_keys(Keys.TAB)
        pass_input.send_keys(Keys.ENTER)
        time.sleep(2)  

    def grab_info_for_year(self, year):
        print(year)
        data_aux = []
        discente = 0
        docente = 0
        externo = 0

        self.driver.get("https://sigaa.unb.br/sigaa/extensao/Atividade/lista.jsf")

        ano_input = self.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaAno"]')

        ano_input.clear()
        ano_input.click()
        ano_input.send_keys(year)
        ano_input.submit() 

        curso_projeto_select = Select(self.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaTipoAcao"]'))
        curso_projeto_select.select_by_visible_text('PROJETO')

        search_button = self.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:btBuscar"]')
        search_button.click()

        rows_table_result = self.driver.find_elements_by_xpath("//*[@id='listagem']/tbody/tr")
        print("Foram encontrados {} projetos. Guardando os dados.".format(len(rows_table_result)))

        for row_number in range(len(rows_table_result)):
            self.driver.find_element(By.XPATH, '//*[@id="form:j_id_jsp_1439633680_522:{}:visualizar"]/img'.format(row_number)).click()


            html=self.driver.page_source
            soup=BeautifulSoup(html,'html.parser')
            #div=soup.select_one("div#listagem")
            table = soup.find('table', id="tbEquipe")
            table_df = pd.read_html(str(table))[0]
            table_df  = table_df.iloc[: , :6]
            discente_equipe = []
            docente_equipe = []
            externo_equipe = []

            departamentoCoordenador = ""

            element_atingido = self.driver.find_element_by_xpath('//th[contains(text(), "Público Real Atingido:")]/following-sibling::td')
            element_financiamento = self.driver.find_element_by_xpath('//th[contains(text(), "Fonte de Financiamento:")]/following-sibling::td')
            element_situacao = self.driver.find_element_by_xpath('//th[contains(text(), "Situação:")]/following-sibling::td')
            estimado_interno = self.driver.find_element_by_xpath('//th[contains(text(), "Público Estimado Externo:")]/following-sibling::td')
            estimado_externo = self.driver.find_element_by_xpath('//th[contains(text(), "Público Estimado Interno:")]/following-sibling::td')

            tipo_financiamento  = element_financiamento.text.strip()
            element_situacao  = element_situacao.text.strip()
            estimado_interno  = estimado_interno.text.strip()
            estimado_externo  = estimado_externo.text.strip()
            publico_atingido = re.sub('[^0-9]', '', element_atingido.text.strip())

            if not publico_atingido:
                publico_atingido = "0"
            publico_atingido = int(publico_atingido)

            
            # Pega o departamento do coordenador geral para colocar como o departamento do externo
            for membro in table_df.to_dict('records'):
                if(membro['Função'] == 'COORDENADOR(A) GERAL'):
                    departamentoCoordenador = membro['Unidade']
            

            for membro in table_df.to_dict('records'):
                if(membro['Categoria'] == 'EXTERNO'):
                    externo = externo + 1
                    externo_equipe.append({
                        "nome": membro['Nome'],
                        "Funcao": membro['Função'],
                        "Departamento": departamentoCoordenador

                    })
                if(membro['Categoria'] == 'DOCENTE'):
                    docente = docente + 1
                    docente_equipe.append({
                        "nome": membro['Nome'],
                        "Funcao": membro['Função'],
                        "Departamento": membro['Unidade']

                    })
                if(membro['Categoria'] == 'DISCENTE'):
                    discente = discente + 1
                    discente_equipe.append({
                        "nome": membro['Nome'],
                        "Funcao": membro['Função'],
                        "Departamento": membro['Unidade']

                    })
            
            data_aux.append({
                "codigo":self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/form/table/tbody/tr[2]/td').text,
                "projeto":self.driver.find_element_by_xpath('/html/body/div[2]/div[2]/form/table/tbody/tr[3]/td').text,
                "publico_atingido": publico_atingido,
                "tipo_financiamento": tipo_financiamento,
                "situacao": element_situacao,
                "estimado_interno": estimado_interno,
                "estimado_externo": estimado_externo,
                "qntd_externo": externo,
                "qntd_discente": discente,
                "qntd_docente": docente,
                "docentes": docente_equipe,
                "discente": discente_equipe,
                "externo_equipe": externo_equipe,
                "ano": "2020",
            })
            discente = 0
            docente = 0
            externo = 0
            self.driver.execute_script("window.history.go(-1)")

        return data_aux

    def grab_info(self):
        self.initialize_driver()
        self.login()

        years = ["0", "2020", "2021", "2022", "2023"]
        data_total = []

        for year in years:
            data_total.append(self.grab_info_for_year(year))

        with open("projetosOtimized.json", "w", encoding='utf8') as outfile:
            json.dump(data_total, outfile, ensure_ascii=False)

        self.driver.quit()

if __name__ == "__main__":
    collector = ColectMetricProjectsOtimized()
    collector.grab_info()