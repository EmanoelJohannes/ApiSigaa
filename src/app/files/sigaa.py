from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as cond
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
from threading import *
from time import sleep
import pandas as pd
import json
from bs4 import BeautifulSoup
#driver = webdriver.Chrome(ChromeDriverManager().install())
#grabber_sigaa = SigaaGrabber()

class SigaaGrabber(Thread):

    def __init__(self):
        pass

    def document_initialised(self,driver):
        return driver.execute_script("return initialised")

    def grab_info(self):
        options = webdriver.ChromeOptions()
        options.add_argument("window-size=1500,800")
        prefs = {"profile.managed_default_content_settings.images": 2}
        options.add_experimental_option("prefs", prefs)

        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                             "(KHTML, like Gecko) Chrome/90.0.4412.3 Safari/537.36")
        #driver = webdriver.Chrome(ChromeDriverManager().install())
        driver = webdriver.Chrome(ChromeDriverManager().install())
        
        #wait = WebDriverWait(my_driver, 20)
        #epoch = str(int(datetime.datetime(int(data.split('/')[2]),int(data.split('/')[1]),int(data.split('/')[0]),10,0).timestamp())) + '000'
        driver.get(f'https://sigaa.unb.br/sigaa/verTelaLogin.do')

        user_input = driver.find_element(By.NAME, 'user.login')
        pass_input = driver.find_element(By.NAME, 'user.senha')

        user_input.send_keys("170140997")
        pass_input.send_keys("Dia1406199")
        pass_input.send_keys(Keys.TAB)
        pass_input.send_keys(Keys.ENTER)


        ##/html/body/div[2]/div[2]/form[1]/table/tbody/tr[8]/td[2]/label
        ##/html/body/div[2]/div[2]/form[1]/table/tbody/tr[8]/td[1]/input
        ##//*[@id="formBuscaAtividade:selectBuscaEdital"]
        ##id=formBuscaAtividade:buscaEdital

        ##//*[@id="formBuscaAtividade:buscaEdital"]
        ##/html/body/div[2]/div[2]/form[1]/table/tbody/tr[8]/td[3]/select

        #WebDriverWait(driver, timeout=10).until(self.document_initialised)
        driver.get("https://sigaa.unb.br/sigaa/extensao/Atividade/lista.jsf")
        #WebDriverWait(driver, timeout=15).until(self.document_initialised)



        ## Edital
        #edital_input = driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:selectBuscaEdital"]').click()
        #edital_select = Select(driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaEdital"]'))
        #edital_select.select_by_visible_text('Semana Universitária 2022 - Decanato de Extensão')


        # Curso Projeto
        
        curso_projeto_select = Select(driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaTipoAcao"]'))
        curso_projeto_select.select_by_visible_text('PROJETO')

        Select(driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaCentroUnidadeAcademicaDiscente"]')).select_by_visible_text('DEPTO CIÊNCIAS DA COMPUTAÇÃO')

        #driver.click("id=formBuscaAtividade:selectBuscaEdital")
        #driver.click("id=formBuscaAtividade:buscaEdital")
        #driver.select("id=formBuscaAtividade:buscaEdital", "label=Semana Universitária 2022 - Decanato de Extensão")
        driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:btBuscar"]').click()
        

        
        ##result_table = Select(driver.find_element(By.XPATH, '//*[@id="listagem"]'))
        rows_table_result = driver.find_elements_by_xpath("//*[@id='listagem']/tbody/tr")
        print("Foram encontados {} projetos. Guardando os dados.".format(len(rows_table_result)))
        print('keeping SIGAA open cuz this shit is crazy at macos')

#//*[@id="form:j_id_jsp_1439633680_535:0:visualizar"]/img
#//*[@id="form:j_id_jsp_1439633680_535:1:visualizar"]/img


        data = []

        for row_number in range(len(rows_table_result)):
            driver.find_element(By.XPATH, '//*[@id="form:j_id_jsp_1439633680_506:{}:visualizar"]/img'.format(row_number)).click()


            print(row_number)
            #roject_info_table = driver.find_elements_by_xpath("//*[@id='listagem']/tbody/tr");

            html=driver.page_source
            soup=BeautifulSoup(html,'html.parser')
            #div=soup.select_one("div#listagem")
            table = soup.find('table', id="tbEquipe")
            table_df = pd.read_html(str(table))[0]
            table_df  = table_df.iloc[: , :6]

            data.append({
                "codigo":driver.find_element_by_xpath('/html/body/div[2]/div[2]/form/table/tbody/tr[2]/td').text,
                "projeto":driver.find_element_by_xpath('/html/body/div[2]/div[2]/form/table/tbody/tr[3]/td').text,
                "membros":table_df.to_dict('records')
            })


            #atividades_elements =driver.find_element(By.XPATH, '//*[@id="tbAtividades"]')
            #tables_atividades = soup.find('table', id="tbAtividades")

            #print(tables_atividades)

            try:
                for membro in data[row_number]['membros']:
                    #membro['Nome'])
                    nome=membro['Nome']
                    print(nome)
                    print(driver.find_elements_by_xpath("//td[contains(text(), '{}')]".format(nome))[2].find_element_by_xpath("./following-sibling::td[2]").text)
                    membro['carga']=driver.find_elements_by_xpath("//td[contains(text(), '{}')]".format(nome))[2].find_element_by_xpath("./following-sibling::td[2]").text;
                    #print(driver.find_elements_by_xpath("//td[contains(text()/following-sibling::td[2], '{}')]".format(nome))[0].text)
                    #print(driver.find_elements_by_xpath("//td[contains(text()/following-sibling::td[3], '{}')]".format(nome))[0].text)


            except:
                print("esse n tem")

                    #print(driver.select_by_visible_text(nome).find_element(By.XPATH,"./following::td[3]").text)     
            driver.execute_script("window.history.go(-1)")


        

        with open("results.json", "w",encoding='utf8') as outfile:
            json.dump(data, outfile,ensure_ascii=False)

        # id da table sigaa 
                ##//*[@id="listagem"]



        #

        sleep(2000)
        driver.service.stop()
        sleep(3)




class totalDocentesAno(Thread):

    def __init__(self):
        pass

    def document_initialised(self,driver):
        return driver.execute_script("return initialised")

    def grab_info(self):
        options = webdriver.ChromeOptions()
        options.add_argument("window-size=1500,800")
        prefs = {"profile.managed_default_content_settings.images": 2}
        options.add_experimental_option("prefs", prefs)

        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                             "(KHTML, like Gecko) Chrome/90.0.4412.3 Safari/537.36")
        #driver = webdriver.Chrome(ChromeDriverManager().install())
        driver = webdriver.Chrome(ChromeDriverManager().install())
        
        #wait = WebDriverWait(my_driver, 20)
        #epoch = str(int(datetime.datetime(int(data.split('/')[2]),int(data.split('/')[1]),int(data.split('/')[0]),10,0).timestamp())) + '000'
        driver.get(f'https://sigaa.unb.br/sigaa/verTelaLogin.do')

        user_input = driver.find_element(By.NAME, 'user.login')
        pass_input = driver.find_element(By.NAME, 'user.senha')

        user_input.send_keys("170140997")
        pass_input.send_keys("Dia1406199")
        pass_input.send_keys(Keys.TAB)
        pass_input.send_keys(Keys.ENTER)


        ##/html/body/div[2]/div[2]/form[1]/table/tbody/tr[8]/td[2]/label
        ##/html/body/div[2]/div[2]/form[1]/table/tbody/tr[8]/td[1]/input
        ##//*[@id="formBuscaAtividade:selectBuscaEdital"]
        ##id=formBuscaAtividade:buscaEdital

        ##//*[@id="formBuscaAtividade:buscaEdital"]
        ##/html/body/div[2]/div[2]/form[1]/table/tbody/tr[8]/td[3]/select

        #WebDriverWait(driver, timeout=10).until(self.document_initialised)
        driver.get("https://sigaa.unb.br/sigaa/extensao/Atividade/lista.jsf")
        #WebDriverWait(driver, timeout=15).until(self.document_initialised)
        edital_select = Select(driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaTipoAcao"]'))
        edital_select.select_by_visible_text('PROJETO')
        #driver.click("id=formBuscaAtividade:selectBuscaEdital")
        #driver.click("id=formBuscaAtividade:buscaEdital")
        #driver.select("id=formBuscaAtividade:buscaEdital", "label=Semana Universitária 2022 - Decanato de Extensão")

        ano_select = driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:selectBuscaAno"]').click()
        ano_input = driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaAno"]')
        ano_input.click()
        ano_input.send_keys('2021')
        ano_input.submit() 


        driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:btBuscar"]').click()
        
        print('keeping SIGAA open cuz this shit is crazy at macos')

        ##result_table = Select(driver.find_element(By.XPATH, '//*[@id="listagem"]'))
        rows_table_result = driver.find_elements_by_xpath("//*[@id='listagem']/tbody/tr")
        print("Foram encontados {} projetos. Guardando os dados.".format(len(rows_table_result)))
        print('keeping SIGAA open cuz this shit is crazy at macos')

        data = []
        docentes = 0

        for row_number in range(len(rows_table_result)):
            driver.find_element(By.XPATH, '//*[@id="form:j_id_jsp_1439633680_506:{}:visualizar"]/img'.format(row_number)).click()

            print('========================================')

            html=driver.page_source
            soup=BeautifulSoup(html,'html.parser')
            #div=soup.select_one("div#listagem")
            table = soup.find('table', id="tbEquipe")
            table_df = pd.read_html(str(table))[0]
            table_df  = table_df.iloc[: , :6]

            for membro in table_df.to_dict('records'):
                print(membro['Categoria'])
                if(membro['Categoria'] == 'DOCENTE'):
                    print("É")
                    docentes = docentes + 1
            
            data.append({
                "codigo":driver.find_element_by_xpath('/html/body/div[2]/div[2]/form/table/tbody/tr[2]/td').text,
                "projeto":driver.find_element_by_xpath('/html/body/div[2]/div[2]/form/table/tbody/tr[3]/td').text,
                "docentes":docentes
            })

            print(data)
            docentes = 0
            driver.execute_script("window.history.go(-1)")
            
            with open("docentes.json", "w",encoding='utf8') as outfile:
                json.dump(data, outfile,ensure_ascii=False)

        
        # id da table sigaa 
                ##//*[@id="listagem"]


      
        sleep(2000)
        driver.service.stop()
        sleep(3)

