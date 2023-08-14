import unittest
from selenium.common.exceptions import NoSuchElementException
from script import ColectMetricProjectsOtimized 
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

class TestColectMetricProjectsOtimized(unittest.TestCase):

    def setUp(self):
        self.collector = ColectMetricProjectsOtimized()
        self.collector.initialize_driver()

    def tearDown(self):
        self.collector.driver.quit()

    # Teste para verificar se a identificação dos campos de login falharam
    def test_login_elements(self):
        self.collector.driver.get('https://sigaa.unb.br/sigaa/verTelaLogin.do')

        try:
            self.collector.driver.find_element(By.NAME, 'username')
            self.collector.driver.find_element(By.NAME, 'password')
            print("Passou no teste do login...")

        except NoSuchElementException:
            self.fail("Campo username/password nao encontrado!")

    # Teste para verificar se a identificação do botão de visualziar a ação falhou
    def test_lupa_elements(self):

        self.collector.driver.get('https://sigaa.unb.br/sigaa/verTelaLogin.do')
        user_input = self.collector.driver.find_element(By.NAME, 'username')
        pass_input = self.collector.driver.find_element(By.NAME, 'password')
        user_input.send_keys("170140997")
        pass_input.send_keys("Dia1406199")
        pass_input.send_keys(Keys.TAB)
        pass_input.send_keys(Keys.ENTER)

        self.collector.driver.get("https://sigaa.unb.br/sigaa/extensao/Atividade/lista.jsf")
        ano_input = self.collector.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaAno"]')
        ano_select = self.collector.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:selectBuscaAno"]').click()

        ano_input.click()
        ano_input.send_keys('2020')
        ano_input.submit() 

        curso_projeto_select = Select(self.collector.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:buscaTipoAcao"]'))
        curso_projeto_select.select_by_visible_text('PROJETO')

        search_button = self.collector.driver.find_element(By.XPATH, '//*[@id="formBuscaAtividade:btBuscar"]')
        search_button.click()

        rows_table_result = self.collector.driver.find_elements_by_xpath("//*[@id='listagem']/tbody/tr")


        try:
            self.collector.driver.find_element(By.XPATH, '//*[@id="form:j_id_jsp_1439633680_522:{}:visualizar"]/img'.format(1)).click()
            print("Passou no teste da Lupa...")
        except NoSuchElementException:
            self.fail("Nao foi possivel clicar na lupa!")



if __name__ == '__main__':
    unittest.main()
