import json
import re
import os
import argparse

lastListener = None
lastParams = None
lastKey = None

appendEIV = False

scriptToAdd = ""
stylesToAdd = ""


def map_listener_to_js(listener, id_):
    global appendEIV, lastKey

    if listener == "reach":
        appendEIV = True
        id_ = id_[0]
        return f"window.addEventListener('scroll', () => {{ if(eiv(document.getElementById(\"{id_}\"))) {{"
    elif listener == "timer":
        return f"setTimeout(() => {{"
    elif listener == "change":
        id_ = id_[0]
        return f"document.getElementById(\"{id_}\").addEventListener('change', () => {{"
    elif listener == "click":
        id_ = id_[0]
        return f"document.getElementById(\"{id_}\").addEventListener('click', () => {{"
    elif listener == "keydown":
        key = id_[1]
        lastKey = key

        id_ = id_[0]
        return f"document.getElementById(\"{id_}\").addEventListener('keydown', (e) => {{ if (e.key === \"{key}\") {{"


def map_trigger_to_js(trigger):
    splitted = trigger.split("(")
    action, params = splitted[0], "(".join(splitted[1:])

    params = params[:-1]  # Remove closing parenthesis

    val_param = None
    if "val(" in params:
        val_start_index = params.index("val(")
        val_end_index = params[val_start_index:].index(")")
        val_param = params[val_start_index + 4: val_start_index +
                           val_end_index]

        params = params[val_start_index + val_end_index + 2:]

    if action == "val":
        return f"document.getElementById({params}).value"
    elif action == "swap":
        if val_param:
            id_ = params
            content = f"document.getElementById({val_param}).value"
        else:
            content, id_ = params.split(",")
        return f"document.getElementById({id_.strip()}).innerHTML = {content};"
    elif action == "show":
        return f"document.getElementById({params.strip()}).style.display = 'block';"
    elif action == "hide":
        return f"document.getElementById({params.strip()}).style.display = 'none';"


def isElementInViewport():
    # JavaScript implementation to check if element is in viewport
    return "function eiv(el) {\n" \
           "    var rect = el.getBoundingClientRect();\n" \
           "    return (\n" \
           "        rect.top >= 0 &&\n" \
           "        rect.left >= 0 &&\n" \
           "        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&\n" \
           "        rect.right <= (window.innerWidth || document.documentElement.clientWidth)\n" \
           "    );\n" \
           "}"


def convert_to_javascript(script):
    global lastListener, lastParams, appendEIV

    lines = script.split('\n')
    js_code = []

    for line in lines:
        line = line.strip()

        if line.startswith("on("):
            pattern = re.compile(r"[ \"\']")
            l = pattern.sub("", line)

            splitted = l[3:-2].split(",")
            listener, id_ = splitted[0], splitted[1:]

            lastListener = listener
            lastParams = id_[0]

            js_code.append(map_listener_to_js(listener, id_))
        elif line.strip().endswith(");"):
            trigger = line[:-1]
            js_code.append(map_trigger_to_js(trigger))
        elif line.strip() == "}":
            if lastListener == "timer":
                js_code.append(f"}}, {int(lastParams)});")
            else:
                endingBrackets = ""
                if lastListener == "reach":
                    endingBrackets = "}"
                elif lastListener == "keydown":
                    endingBrackets = "}"
                js_code.append(f"}}{endingBrackets});")

    return "\n".join(js_code) + "\n" + (isElementInViewport() if appendEIV else "")


# set working directory to current file
os.chdir(os.path.dirname(os.path.abspath(__file__)))


def generateHTML(filepath: str) -> None:
    with open(filepath, "r", encoding="utf-8") as mamlFile:
        html = set()
        configFile = open("mamlConfig.json", "r")

        config: list[dict] = json.load(configFile)
        commonProps = {"w": "width", "h": "height", "x": "left", "y": "top"}

        script = ""

        mamlData = []
        for line in mamlFile:
            l = json.loads(line)
            if "type" not in l:
                continue
            if l["type"] != "script":
                mamlData.append(json.loads(line))
            else:
                script = l["code"]

        mamlData.sort(key=lambda x: x["level"])

        carouselPresence = False
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
                    if tag == "img" and key == "src":
                        attrs += f"{key}='{value[0]['thumbnail']}'"
                    else:
                        attrs += f"{key}='{value}'"
                    continue

                for r, t in enumerate(tagConfig["style"]):
                    if t == key:
                        k = re.sub(r'(?<!^)(?=[A-Z])', '-', key).lower()
                        style += f"{k}:{value};"
                        stylePresence = True
                        continue

                if key in commonProps:
                    style += f"{commonProps[key]}:{value}px;"
                    continue

                if key == "text":
                    text = "<br />".join(value.splitlines())

                if key == "options":
                    for option in value:
                        text += f"<option value='{option}'>{option}</option>"

            if tag == "div" and not stylePresence and data["type"] != "carousel":
                continue

            if data["type"] == "carousel":
                carouselPresence = True
                tag = "div"
                
                if "id" in data:
                    attrs += f"id='{data['id']}'"

                style += f"overflow:hidden;"

                text += f"<div class='s-c' style='width:{data['w'] * len(data['src'])}px;'>"

                for i, img in enumerate(data["src"]):
                    text += (
                        f"<div class='s'><img src='{img['thumbnail']}'class='s'style='width:{data['w']}px;'/></div>")

                text += "</div>"

            if data["type"] == "video":
                text += f"<source src='{data['src']}' />"
                attrs += "controls"

            style += f"z-index:{data['level'] if (tag != 'a') else 99999};"

            h = f"<{tag} {attrs} style='position:absolute;{style}'>{text}</{tag}>"
            if ("link" in data and data['link'] != ""):
                h = f"<a href='{data['link']}' target='_blank'>{h}</a>"
            html.add(h)

        html = ["""<!DOCTYPE html><html><head><meta charset="utf-8" /><style>a,a:hover,a:visited,a:active{color:inherit;text-decoration:none;}"""] + [""".s-c{display:flex;animation:10s infinite slide}@keyframes slide{0%,100%{transform:translateX(0)}50%{transform:translateX(-50%)}}.s img{height:100%;object-fit:cover;}""" if carouselPresence else ""] + [
            """</style></head><body>"""] + list(html) + ["""<script>"""] + [convert_to_javascript(script)] + ["""</script></body></html>"""]

        if not os.path.exists("output"):
            os.mkdir("output")
        
        with open(f"../../public/html/{os.path.basename(filepath).replace('.maml', '.html')}", "w", encoding="utf-8") as f:
            f.writelines(html)

        print("done")


def main(filePath: str) -> None:
    generateHTML(filePath)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Translate a MAML file to HTML')
    parser.add_argument('filePath', type=str, help='MAML path to convert')
    args = parser.parse_args()

    main(args.filePath)
