import ItemOptions from "../ItemOptions";
import { useEffect, useState } from "react";

interface Props {
  layoutProps: any[];
  index: number;
  setLayoutProps: Function;
  initialText?: string;
  showOptions: boolean;
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

  useEffect(() => {
    if (props.initialText) {
      props.layoutProps[props.index].text = props.initialText;
      props.setLayoutProps([...props.layoutProps]);
    }
  }, []);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseOver={() => {
        if (props.showOptions) setOptionsVisible(true);
        clearTimeout(tout);
      }}
      onMouseOut={() => {
        setTout(
          setTimeout(() => {
            if (props.showOptions) setOptionsVisible(false);
          }, 2000),
        );
      }}
      onMouseMove={() => {
        if (props.showOptions) setOptionsVisible(true);
        clearTimeout(tout);
      }}
    >
      <textarea
        placeholder={"Text..."}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          outline: 0,
          border: "none",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          resize: "none",
          ...textStyles(),
        }}
        value={props.layoutProps[props.index].text || ""}
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
