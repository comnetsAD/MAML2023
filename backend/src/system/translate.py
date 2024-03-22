from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import StaleElementReferenceException

import time
import os
import json
import re
import argparse

from utils import verifyURL
from logger import setupLogger
from generateHTML import generateHTML

logger = setupLogger("translate")
logger.debug("Starting translation")

defaults = ["0px", "none", "auto", "rgba(0, 0, 0, 0)"]


def setup(adblocker=False) -> webdriver.Chrome:
    if os.name == "nt":
        driver_path = os.path.join(os.getcwd(), "chromedriver.exe")
    else:
        driver_path = os.path.join(os.getcwd(), "chromedriver")

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--window-size=1200,800")

    if adblocker:
        chrome_options.add_extension(os.path.join(
            os.getcwd(), "extensions", "adblocker.crx"))
        chrome_options.add_extension(os.path.join(
            os.getcwd(), "extensions", "adguard.crx"))

    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)

    if adblocker:
        driver.get("https://adblock-tester.com/")
        time.sleep(3)

        # close all other tabs
        for handle in driver.window_handles[1:]:
            driver.switch_to.window(handle)
            driver.close()
        driver.switch_to.window(driver.window_handles[0])
        driver.get("https://adblock-tester.com/")

        time.sleep(3)

    return driver


def scrollToBottom(driver: webdriver.Chrome) -> None:
    SCROLL_PAUSE_TIME = 1
    SCROLL_AMOUNT = "window.scrollBy(0, window.innerHeight);"

    scrolled = 0
    while True and scrolled < 10:
        driver.execute_script(SCROLL_AMOUNT)

        time.sleep(SCROLL_PAUSE_TIME)
        scrolled += 1

        current_scroll_position = driver.execute_script(
            "return window.scrollY;")

        new_scroll_position = current_scroll_position + 100

        if new_scroll_position >= driver.execute_script("return document.body.scrollHeight - window.innerHeight;"):
            break

    driver.execute_script("window.scrollTo(0, 0);")


def getText(driver: webdriver.Chrome, element: webdriver.Chrome) -> str:
    return driver.execute_script(
        """
                var parent = arguments[0];
				var child = parent.firstChild;

				var result = "";
				while (child) {
				    if (child.nodeType === Node.TEXT_NODE || (child.nodeType === Node.ELEMENT_NODE && ["STRONG", "B", "I", "U"].includes(child.tagName)))
				        result += child.textContent;
                    
				    child = child.nextSibling;
				}
				return result;
                """, element)


def num(attr):
    return int(attr) if attr else 0


def traverse_elements(element: webdriver.Chrome, config: dict, driver: webdriver.Chrome, mamlContent, level: int = 1) -> None:
    for child_element in element.find_elements(By.XPATH, "*"):
        elementConfig = config[child_element.tag_name] if child_element.tag_name in config else None

        if elementConfig:
            attributes = elementConfig["attr"]
            styles = elementConfig["style"]

            elementMAML = {"type": config[child_element.tag_name]["type"]}
            try:
                elementMAML["w"] = num(child_element.rect.get("width")) - num(
                    child_element.get_attribute("marginRight")) - num(child_element.get_attribute("marginLeft"))
                elementMAML["h"] = num(child_element.rect.get("height")) - num(
                    child_element.get_attribute("marginBottom")) - num(child_element.get_attribute("marginTop"))

                elementMAML["x"] = num(child_element.rect.get(
                    "x")) + num(child_element.get_attribute("marginLeft"))
                elementMAML["y"] = num(child_element.rect.get(
                    "y")) + num(child_element.get_attribute("marginTop"))

                if elementMAML["x"] < 0 or elementMAML["x"] > driver.execute_script("return window.innerWidth;"):
                    continue

                if elementMAML["w"] > 5 and elementMAML["h"] > 5:
                    for attr in attributes:
                        value = child_element.get_attribute(attr) or ""
                        if value:
                            elementMAML[attr] = value

                    for style in styles:
                        value = driver.execute_script(
                            f"return window.getComputedStyle(arguments[0]).{style}", child_element) or ""

                        if value and value not in defaults:
                            elementMAML[style] = value

                    # get text if text is direct child of element
                    # has_children = child_element.find_elements(By.XPATH, "*")
                    has_children = False
                    text = child_element.text if not has_children else ""

                    if text:
                        elementMAML["text"] = text.strip()

                    # add level
                    elementMAML["level"] = level

                    if elementMAML["type"] == "text" and not text:
                        continue

                    # write in utf-8 encoding
                    content = json.dumps(elementMAML,
                                         ensure_ascii=False)
                    mamlContent.write(content)
                    mamlContent.write("\n")

            except StaleElementReferenceException as e:
                logger.debug("Stale Element", child_element.tag_name)

        traverse_elements(child_element, config, driver,
                          mamlContent, level + 1)


def main(url) -> None:
    startTime = time.time()

    # set up the browser
    driver = setup(False)

    with open(os.path.join(os.getcwd(), "tagsConfig.json")) as f:
        config = json.load(f)

        # verify if URL is valid
        if not verifyURL(url):
            raise Exception("Invalid URL")

        driver.get(url)
        scrollToBottom(driver)

        filename = re.sub(r"[^A-Za-z]", "", url) + ".maml"
        folderpath = "../../public/output/"

        os.makedirs(folderpath, exist_ok=True)

        with open(os.path.join(folderpath, filename), "w", encoding="utf-8") as f:
            body_element = driver.find_element(By.TAG_NAME, "body")

            traverse_elements(body_element, config, driver, f)

    driver.quit()

    endTime = time.time()
    logger.debug(f"Time taken: {endTime - startTime} seconds")
    print(filename)
    print(endTime-startTime, end="")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Translate a web page to MAML')
    parser.add_argument('url', type=str, help='URL to translate')
    args = parser.parse_args()

    main(args.url)
