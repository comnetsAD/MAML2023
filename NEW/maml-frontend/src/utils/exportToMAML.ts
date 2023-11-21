import GridLayout from "react-grid-layout";
export default function ExportToMAML(
  data: {
    layout: GridLayout.Layout[];
    props: any[];
  },
  mamlCode: string,
) {
  let a = { a: "a" };

  typeof a;
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

        if (value === "") {
          delete data.props[index][key];
        } else {
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

  // prompt file download save as .maml
  const element = document.createElement("a");
  const file = new Blob([layout.join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  element.href = URL.createObjectURL(file);
  element.download = "export.maml";
  document.body.appendChild(element);
  element.click();

  // remove element
  document.body.removeChild(element);
}
