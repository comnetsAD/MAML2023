import ItemOptions from "../ItemOptions";
import { useState } from "react";

interface Props {
  layoutProps: any[];
  index: number;
  setLayoutProps: Function;
  initialText?: string;
}

export default function TextItem(props: Props) {
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [tout, setTout] = useState<NodeJS.Timeout>();

  const textStyles = () => {
    let styles: any = {};
    if (props.layoutProps[props.index].bold) {
      styles.fontWeight = "bold";
    }
    if (props.layoutProps[props.index].italic) {
      styles.fontStyle = "italic";
    }
    if (props.layoutProps[props.index].underline) {
      styles.textDecoration = "underline";
    }
    if (props.layoutProps[props.index].fontSize) {
      styles.fontSize = props.layoutProps[props.index].fontSize;
    }
    if (props.layoutProps[props.index].fontFamily) {
      styles.fontFamily = props.layoutProps[props.index].fontFamily;
    }
    if (props.layoutProps[props.index].textAlign) {
      styles.textAlign = props.layoutProps[props.index].textAlign;
    }
    if (props.layoutProps[props.index].color) {
      styles.color = props.layoutProps[props.index].color;
    }
    return styles;
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseOver={() => {
        setOptionsVisible(true);
        clearTimeout(tout);
      }}
      onMouseOut={() => {
        setTout(
          setTimeout(() => {
            setOptionsVisible(false);
          }, 2000),
        );
      }}
      onMouseMove={() => {
        setOptionsVisible(true);
        clearTimeout(tout);
      }}
    >
      <input
        type="text"
        placeholder={props.initialText ?? "Text..."}
        style={{
          outline: 0,
          border: "none",
          width: "100%",
          backgroundColor: "transparent",
          ...textStyles(),
        }}
        onChange={(e) => {
          props.layoutProps[props.index].text = e.target.value;
          props.setLayoutProps([...props.layoutProps]);
        }}
      />

      <ItemOptions
        index={props.index}
        layoutProps={props.layoutProps}
        setLayoutProps={props.setLayoutProps}
        visible={optionsVisible}
      ></ItemOptions>
    </div>
  );
}
