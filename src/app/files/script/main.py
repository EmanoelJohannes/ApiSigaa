from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from script import ColectMetricProjectsOtimized

#webdriver.Chrome(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install())
#driver = webdriver.Chrome(ChromeDriverManager().install())
grabber_sigaa = ColectMetricProjectsOtimized()


if __name__ == "__main__":
    sigaa_events = grabber_sigaa.grab_info()

