import GridLayout from "react-grid-layout";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { API } from "./requests";
import TokenManager from "./store/UserManager";

function downloadZIP(htmlContent: string, mamlContent: string) {
  const zip = new JSZip();

  zip.file("index.html", htmlContent);
  zip.file("index.maml", mamlContent);

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "export.zip");
  });
}

function stringToFileObject(str: string, filename: string, mimeType: string) {
  const blob = new Blob([str], { type: mimeType });
  const file = new File([blob], filename, { type: mimeType });
  return file;
}

export default function ExportToMAML(
  data: {
    layout: GridLayout.Layout[];
    props: any[];
  },
  mamlCode: string,
  url: string,
): Promise<any> {
  // properties to omit
  let omit = [
    "i",
    "isBounded",
    "isDraggable",
    "isResizable",
    "maxH",
    "maxW",
    "minH",
    "minW",
    "moved",
    "static",
    "resizeHandles",
  ];

  let layout = (data.layout as unknown as { [key: string]: string }[]).map(
    (item, index) => {
      omit.forEach((key, idx) => {
        if (item.hasOwnProperty(key)) {
          delete item[key];
        }

        if (data.props[index].hasOwnProperty(key)) {
          delete data.props[index][key];
        }
      });

      Object.keys(data.props[index]).forEach((key) => {
        let value = data.props[index][key];
        let newKey = key;

        if (key === "bold") {
          newKey = "fontWeight";
          delete data.props[index][key];

          value = value ? "bold" : "normal";
        }

        if (key === "italic") {
          newKey = "fontStyle";
          delete data.props[index][key];

          value = value ? "italic" : "normal";
        }

        if (key === "underline") {
          newKey = "textDecoration";
          delete data.props[index][key];

          value = value ? "underline" : "none";
        }

        if (key === "visibility") {
          newKey = "display";
          delete data.props[index][key];
        }

        if (value === "") {
          delete data.props[index][key];
        } else {
          // check if value is a number
          if (typeof value === "number" && key !== "level") {
            value = value.toString() + "px";
          }
          data.props[index][newKey] = value;
        }
      });

      return {
        ...(item as Object),
        ...(data.props[index] as Object),
      };
    },
  );

  // each item in layout should be a string
  layout = layout.map((item) => JSON.stringify(item));

  if (mamlCode) {
    layout.push(
      JSON.stringify({
        type: "script",
        code: mamlCode,
      }),
    );
  }

  const finalMAML = layout.join("\n");
  const translateDuration = parseFloat(
    sessionStorage.getItem("translateDuration") || "-1",
  );

  const mamlFile = stringToFileObject(finalMAML, "export.maml", "text/plain");

  return API.saveMAML(
    TokenManager.getToken(),
    url,
    mamlFile,
    translateDuration,
  );

  // // prompt file download save as .maml
  // const element = document.createElement("a");
  // const file = new Blob([layout.join("\n")], {
  //   type: "text/plain;charset=utf-8",
  // });
  // element.href = URL.createObjectURL(file);
  // element.download = "export.maml";
  // document.body.appendChild(element);
  // element.click();

  // // remove element
  // document.body.removeChild(element);
}
