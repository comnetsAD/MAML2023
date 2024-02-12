import json
import re
import os
import argparse

# set working directory to current file
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def generateHTML(filepath: str) -> None:
    with open(filepath, "r") as mamlFile:
        html = set()
        configFile = open("mamlConfig.json", "r")

        config: list[dict] = json.load(configFile)
        commonProps = {"w": "width", "h": "height", "x": "left", "y": "top"}

        mamlData = []
        for line in mamlFile:
            mamlData.append(json.loads(line))

        # sort by level
        mamlData.sort(key=lambda x: x["level"])

        for i, data in enumerate(mamlData):
            tag, attrs, style, text = "", "", "", ""

            # find config for tag
            tagConfig = config[data["type"]
                               ] if data["type"] in config.keys() else None

            if tagConfig is None:
                continue

            stylePresence = False
            for key, value in data.items():
                if key == "type":
                    tag = tagConfig["tag"]
                    continue

                if key in tagConfig["attr"]:
                    attrs += f"{key}='{value}'"
                    continue

                for r, t in enumerate(tagConfig["style"]):
                    if t == key:
                        k = re.sub(r'(?<!^)(?=[A-Z])', '-', key).lower()
                        style += f"{k}: {value};"
                        stylePresence = True
                        continue

                if key in commonProps:
                    style += f"{commonProps[key]}:{value}px;"
                    continue

                if key == "text":
                    text = "<br />".join(value.splitlines())

            if tag == "div" and not stylePresence:
                continue

            style += f"z-index: {i if (tag != 'a' and tag != 'img') else 99999};"
            html.add(
                f"<{tag} {attrs}style='position:absolute;{style}'>{text}</{tag}>\n")

        html = ["""<!DOCTYPE html><html><head><meta charset="utf-8" /><link rel="stylesheet" href="style.css"></head><body>"""] + \
            list(html) + ["""</body></html>"""]
        
        # write to file
        with open(f"output/{os.path.basename(filepath).replace('.maml', '.html')}", "w") as f:
            f.writelines(html)

        print("".join(html))


def main(filePath: str) -> None:
    generateHTML(filePath)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Translate a MAML file to HTML')
    parser.add_argument('filePath', type=str, help='MAML path to convert')
    args = parser.parse_args()

    main(args.filePath)