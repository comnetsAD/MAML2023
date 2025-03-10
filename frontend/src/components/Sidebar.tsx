import { Flex } from "@chakra-ui/react";
import { RxText, RxButton, RxDropdownMenu } from "react-icons/rx";
import { RiImageFill } from "react-icons/ri";
import { MdShapeLine, MdOutlineViewCarousel } from "react-icons/md";
import { LuTimer } from "react-icons/lu";
import { BsInputCursorText } from "react-icons/bs";
import { AiFillVideoCamera } from "react-icons/ai";
import { FaWpforms } from "react-icons/fa";

import { useState, useEffect } from "react";

export default function Sidebar() {
  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    component: string,
  ) => {
    const storedCount = sessionStorage.getItem("count") || "0";
    e.dataTransfer.setData("component", component + storedCount);
    sessionStorage.setItem("count", (parseInt(storedCount) + 1).toString());
  };

  useEffect(() => {
    const storedCount = sessionStorage.getItem("count");
    if (!storedCount) {
      sessionStorage.setItem("count", "0");
    }
  }, []);

  return (
    <>
      <Flex direction="column" alignItems="center" gap={10}>
        <div
          title="Text"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "text");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <RxText size={"20px"} />
        </div>

        <div
          title="Shape"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "shape");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <MdShapeLine size={"20px"} />
        </div>

        <div
          title="Image"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "image");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <RiImageFill size={"20px"} />
        </div>

        <div
          title="Image Carousel"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "carousel");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <MdOutlineViewCarousel size={"20px"} />
        </div>

        <div
          title="Video Player"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "video");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <AiFillVideoCamera size={"20px"} />
        </div>

        <div
          title="Text Field"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "text-field");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <BsInputCursorText size={"20px"} />
        </div>

        <div
          title="Button"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "button");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <RxButton size={"20px"} />
        </div>

        <div
          title="Dropdown Menu"
          draggable={true}
          onDragStart={(e) => {
            onDragStart(e, "dropdown");
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <RxDropdownMenu size={"20px"} />
        </div>

      </Flex>
    </>
  );
}
