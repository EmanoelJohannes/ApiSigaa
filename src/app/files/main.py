from sigaa import SigaaGrabber
from sigaa import totalDocentesAno
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager


#webdriver.Chrome(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install())
#driver = webdriver.Chrome(ChromeDriverManager().install())
grabber_sigaa = totalDocentesAno()


if __name__ == "__main__":
    sigaa_events = grabber_sigaa.grab_info()

