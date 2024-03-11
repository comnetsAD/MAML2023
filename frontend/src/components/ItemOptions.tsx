import { FontList } from "@/utils/fontList";
import { MdTextIncrease, MdTextDecrease } from "react-icons/md";
import { TbAlignCenter, TbAlignRight, TbAlignLeft } from "react-icons/tb";
import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { SketchPicker } from "react-color";

interface Props {
  layoutProps: any[];
  index: number;
  setLayoutProps: Function;
  visible: boolean;
}

export default function ItemOptions(props: Props) {
  const defaultIconStyles = { cursor: "pointer", margin: "0 .5rem" };
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [color, setColor] = useState<string>("black");

  return (
    <div
      style={{
        display: props.visible ? "flex" : "none",
        alignItems: "center",
        backgroundColor: "black",
        color: "white",
        position: "absolute",
        top: 0,
        left: 0,
        transform: "translate(0, -120%)",
        padding: "5px 5px",
        fontFamily: "serif",
        fontSize: "16px",
        zIndex: 9999,
      }}
    >
      <select
        onChange={(e) => {
          props.layoutProps[props.index].fontFamily = e.target.value;
          props.setLayoutProps([...props.layoutProps]);
        }}
        style={{
          fontFamily:
            props.layoutProps[props.index].fontFamily || FontList[0].value,
          backgroundColor: "black",
          color: "white",
          border: "solid 1px #ccc",
          marginRight: ".5rem",
        }}
      >
        {FontList.map((font) => (
          <option
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.value }}
          >
            {font.name}
          </option>
        ))}
      </select>
      <span
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].bold =
            !props.layoutProps[props.index].bold;

          props.setLayoutProps([...props.layoutProps]);
        }}
      >
        <b>B</b>
      </span>
      <span
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].italic =
            !props.layoutProps[props.index].italic;

          props.setLayoutProps([...props.layoutProps]);
        }}
      >
        <i>I</i>
      </span>
      <span
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].underline =
            !props.layoutProps[props.index].underline;

          props.setLayoutProps([...props.layoutProps]);
        }}
      >
        <u>U</u>
      </span>

      <MdTextIncrease
        size={20}
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].fontSize =
            (props.layoutProps[props.index].fontSize || 16) + 2;

          props.setLayoutProps([...props.layoutProps]);
        }}
      />
      <MdTextDecrease
        size={20}
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].fontSize =
            (props.layoutProps[props.index].fontSize || 16) - 2;

          props.setLayoutProps([...props.layoutProps]);
        }}
      />

      <TbAlignLeft
        size={20}
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].textAlign = "left";
          props.setLayoutProps([...props.layoutProps]);
        }}
      />
      <TbAlignCenter
        size={20}
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].textAlign = "center";
          props.setLayoutProps([...props.layoutProps]);
        }}
      />
      <TbAlignRight
        size={20}
        style={defaultIconStyles}
        onClick={() => {
          props.layoutProps[props.index].textAlign = "right";
          props.setLayoutProps([...props.layoutProps]);
        }}
      />

      <Box
        backgroundColor={color}
        width={"20px"}
        height={"20px"}
        marginLeft={2}
        borderRadius={2}
        border={"solid 1px white"}
        onClick={() => {
          setColorPickerVisible(!colorPickerVisible);
        }}
      ></Box>

      {colorPickerVisible && (
        <div style={{ position: "absolute", right: 0, top: 40 }}>
          <SketchPicker
            color={color}
            onChange={(color: { hex: string }) => setColor(color.hex)}
          />
        </div>
      )}
    </div>
  );
}
