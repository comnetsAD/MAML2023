import { Box, Flex, Button, Text } from "@chakra-ui/react";
import GridLayout from "react-grid-layout";
import { CSSProperties, useEffect, useState } from "react";
import TextItem from "./layoutItems/TextItem";
import { useDisclosure } from "@chakra-ui/react";
import ShapeSelectorModal from "./modals/ShapeSelectorModal";
import ImageUploaderModal from "./modals/ImageUploaderModal";
import DropdownModal from "./modals/DropdownModal";
import TimerModal from "./modals/TimerModal";
import VideoURLModal from "./modals/VideoURLModal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import FormModal from "./modals/FormModal";
import { CgOptions } from "react-icons/cg";
import OptionsModal from "./modals/OptionsModal";
import IDManager from "@/utils/store/IDManager";

import { IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";
import { IUploadedImage } from "@/utils/types";

interface Props {
  enableOverlaps: boolean;
  callback: (layout: GridLayout.Layout[], props: any[]) => void;
  importedData?: any;
}

export default function MAMLLayout(props: Props) {
  // Layuot
  const [layout, setLayout] = useState<GridLayout.Layout[]>([]);
  const [layoutProps, setLayoutProps] = useState<any[]>([]);

  // Minor Flags
  const [carousel, setCarousel] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<number>();

  // temp -- find a better way
  const optionsStyle: CSSProperties = {
    display: "none",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 200,
    backgroundColor: "black",
    border: "solid 1px white",
    borderRadius: "5px",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
  };

  const {
    isOpen: isShapeSelectorOpen,
    onOpen: onShapeSelectorOpen,
    onClose: onShapeSelectorClose,
  } = useDisclosure();

  const {
    isOpen: isImageUploaderOpen,
    onOpen: onImageUploaderOpen,
    onClose: onImageUploaderClose,
  } = useDisclosure();

  const {
    isOpen: isDropdownOpen,
    onOpen: onDropdownOpen,
    onClose: onDropdownClose,
  } = useDisclosure();

  const {
    isOpen: isTimerOpen,
    onOpen: onTimerOpen,
    onClose: onTimerClose,
  } = useDisclosure();

  const {
    isOpen: isVideoUrlOpen,
    onOpen: onVideoUrlOpen,
    onClose: onVideoUrlClose,
  } = useDisclosure();

  const {
    isOpen: isOptionsOpen,
    onOpen: onOptionsOpen,
    onClose: onOptionsClose,
  } = useDisclosure();

  useEffect(() => {
    props.callback(layout, layoutProps);
  }, [layoutProps, layout]);

  useEffect(() => {
    IDManager.resetIDs();
  }, []);

  useEffect(() => {
    if (props.importedData) {
      const layout: GridLayout.Layout[] = [];
      const layoutProps: any[] = [];

      if (window) {
        let count = parseInt(sessionStorage.getItem("count") || "0");
        props.importedData.forEach((item: any) => {
          if (item.type === "shape") {
            item.type = item.borderRadius === "50%" ? "ellipse" : "rect";
          }

          if (item.type === "image") {
            item.src = [{ source: item.src, thumbnail: item.src }];
          }

          const l = {
            w: item.w,
            h: item.h,
            x: item.x,
            y: item.y,
            i: item.type + count,
          };

          count++;
          layout.push(l);

          delete item.x;
          delete item.y;
          delete item.w;
          delete item.h;
          delete item.i;

          layoutProps.push(item);
        });

        setLayout(layout);
        setLayoutProps(layoutProps);

        sessionStorage.setItem("count", count.toString());
      }
    }
  }, [props.importedData]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { dataTransfer, clientX, clientY } = e;
    const component = dataTransfer.getData("component");

    const componentType = component.replace(/\d/g, "");

    switch (componentType) {
      case "shape":
        onShapeSelectorOpen();
        break;

      case "image":
        setCarousel(false);
        onImageUploaderOpen();
        break;

      case "dropdown":
        onDropdownOpen();
        break;

      case "timer":
        onTimerOpen();
        break;

      case "video":
        onVideoUrlOpen();
        break;

      case "carousel":
        setCarousel(true);
        onImageUploaderOpen();
        break;

      case "form":
        // onFormOpen();
        return;

      default:
        setLayout([
          ...layout,
          { i: component, x: 0, y: 0, w: 200, h: 70, minW: 30, minH: 1 },
        ]);

        let additionalProps: any = {};
        if (componentType === "text") {
          additionalProps = { fontFamily: "Helvetica, sans-serif" };
        } else if (componentType === "button") {
          additionalProps = { text: "Button" };
        }
        setLayoutProps([
          ...layoutProps,
          { type: componentType, level: 1, ...additionalProps },
        ]);
        break;
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const deleteItem = (i: string) => () => {
    let index = 0;
    setLayout(
      layout.filter((item) => {
        if (item.i === i) {
          index = layout.indexOf(item);
        }
        return item.i !== i;
      }),
    );

    setLayoutProps(layoutProps.filter((_item, i) => i !== index));

    IDManager.removeID(i);
  };

  const generateComponent = (layoutItem: GridLayout.Layout) => {
    let component: JSX.Element = <></>;
    const index = layout.indexOf(layoutItem);

    switch (layoutItem.i?.replace(/\d/g, "")) {
      case "text": {
        component = (
          <TextItem
            initialText={layoutProps[index].text}
            layoutProps={layoutProps}
            index={index}
            setLayoutProps={setLayoutProps}
          ></TextItem>
        );
        break;
      }
      case "image":
        component = (
          <img
            src={layoutProps[index].src[0].thumbnail}
            alt="Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        );
        break;

      case "carousel":
        component = (
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            showArrows={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            stopOnHover={true}
          >
            {layoutProps[index].src.map(
              (image: IUploadedImage, idx: number) => (
                <img
                  key={idx}
                  src={image.thumbnail}
                  alt="Image"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ),
            )}
          </Carousel>
        );
        break;

      case "rect":
        component = (
          <div
            style={{
              ...layoutProps[index],
              width: "100%",
              height: "100%",
            }}
          ></div>
        );
        break;

      case "ellipse":
        component = (
          <div
            style={{
              ...layoutProps[index],
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          ></div>
        );
        break;

      case "button":
        component = (
          <Button
            style={{
              ...layoutProps[index],
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              bg: "primary",
            }}
          >
            <input
              type="text"
              style={{
                border: "none",
                backgroundColor: "transparent",
                textAlign: "center",
                color: "black",
                outline: 0,
              }}
              placeholder="Edit Button Text"
              onChange={(e) => {
                layoutProps[index].text = e.currentTarget.value;
                setLayoutProps([...layoutProps]);
              }}
            />
          </Button>
        );
        break;

      case "text-field":
        component = (
          <input
            type="text"
            placeholder="Edit Placeholder"
            onChange={(e) => {
              layoutProps[index].placeholder = e.target.value;
              setLayoutProps([...layoutProps]);
            }}
            style={{ width: "100%", height: "100%" }}
          />
        );
        break;

      case "dropdown":
        component = (
          <div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                zIndex: 1,
              }}
            ></div>
            <select
              style={{
                zIndex: 0,
                border: "solid 1px #ccc",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {layoutProps[index].options.map((_option: string) => (
                <option key={_option}>{_option}</option>
              ))}
            </select>
          </div>
        );
        break;

      case "timer":
        component = (
          <Text fontSize={24} fontWeight="bold">
            {layoutProps[index].start}
          </Text>
        );
        break;

      case "video":
        component = (
          <video
            src={layoutProps[index].src}
            width="100%"
            height="100%"
            controls
            autoPlay={layoutProps[index].autoplay}
          ></video>
        );
        break;

      case "form":
        component = (
          <form
            action={layoutProps[index].action}
            method={layoutProps[index].method}
          ></form>
        );
        break;
    }

    return (
      <div
        className="layout-item"
        key={layoutItem.i}
        style={{
          border: "1px solid #ccc",
          position: "relative",
          zIndex: layoutProps[index].level,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            lineHeight: "16px",
            cursor: "pointer",
            zIndex: 200,
          }}
          onClick={deleteItem(layoutItem.i)}
        >
          &times;
        </div>

        <div
          className="options"
          style={optionsStyle}
          onClick={() => {
            setSelectedElement(index);
            onOptionsOpen();
          }}
        >
          <CgOptions />
        </div>

        <div
          className="options"
          style={{ ...optionsStyle, left: 40 }}
          onClick={() => {
            layoutProps[index].level += 1;
            setLayoutProps([...layoutProps]);
          }}
        >
          <IoMdArrowRoundUp />
        </div>
        <div
          className="options"
          style={{ ...optionsStyle, left: 80 }}
          onClick={() => {
            layoutProps[index].level -= 1;
            setLayoutProps([...layoutProps]);
          }}
        >
          <IoMdArrowRoundDown />
        </div>
        {component}
      </div>
    );
  };

  return (
    <>
      <Flex direction="row" alignItems={"center"} justifyContent={"center"}>
        <Box
          width="1200px"
          minHeight="800px"
          bg="white"
          margin="1rem"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <GridLayout
            className="layout"
            layout={layout as GridLayout.Layout[]}
            cols={1200}
            rowHeight={1}
            useCSSTransforms={false}
            width={1200}
            autoSize={true}
            margin={[0, 0]}
            compactType={null}
            allowOverlap={props.enableOverlaps}
            onLayoutChange={(layout: any) => {
              setLayout([...layout]);
            }}
            onDragStop={(layout: any) => {
              setLayout([...layout]);
            }}
          >
            {layout.map((item) => {
              return generateComponent(item);
            })}
          </GridLayout>
        </Box>
      </Flex>

      <ShapeSelectorModal
        onClose={onShapeSelectorClose}
        isOpen={isShapeSelectorOpen}
        callback={(value: string, color: string) => {
          setLayout([
            ...layout,
            {
              i: value + sessionStorage.getItem("count"),
              x: 0,
              y: 0,
              w: 100,
              h: 30,
              minW: 2,
              minH: 1,
            },
          ]);
          setLayoutProps([
            ...layoutProps,
            {
              level: 1,
              backgroundColor: color,
              type: "shape",
              borderRadius: value === "rect" ? "0px" : "50%",
            },
          ]);
        }}
      />

      <ImageUploaderModal
        carousel={carousel}
        onClose={onImageUploaderClose}
        isOpen={isImageUploaderOpen}
        callback={(value: IUploadedImage[]) => {
          setLayout([
            ...layout,
            {
              i:
                (carousel ? "carousel" : "image") +
                sessionStorage.getItem("count"),
              x: 0,
              y: 0,
              w: 200,
              h: 200,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([
            ...layoutProps,
            {
              level: 1,
              src: value,
              objectFit: "cover",
              type: value.length > 1 ? "carousel" : "image",
            },
          ]);
        }}
      />

      <DropdownModal
        onClose={onDropdownClose}
        isOpen={isDropdownOpen}
        callback={(options: string[]) => {
          setLayout([
            ...layout,
            {
              i: "dropdown" + sessionStorage.getItem("count"),
              x: 0,
              y: 0,
              w: 100,
              h: 30,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([
            ...layoutProps,
            { options: options, level: 1, type: "dropdown" },
          ]);
        }}
      />
      <TimerModal
        onClose={onTimerClose}
        isOpen={isTimerOpen}
        callback={(start: number, end: number) => {
          setLayout([
            ...layout,
            {
              i: "timer" + sessionStorage.getItem("count"),
              x: 0,
              y: 0,
              w: 100,
              h: 30,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([
            ...layoutProps,
            { start: start, end: end, level: 1, type: "timer" },
          ]);
        }}
      />

      <VideoURLModal
        onClose={onVideoUrlClose}
        isOpen={isVideoUrlOpen}
        callback={(url: string, autoplay: boolean) => {
          setLayout([
            ...layout,
            {
              i: "video" + sessionStorage.getItem("count"),
              x: 0,
              y: 0,
              w: 100,
              h: 100,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([
            ...layoutProps,
            { src: url, autoplay: autoplay, level: 1, type: "video" },
          ]);
        }}
      />

      {/* <FormModal
        onClose={onFormClose}
        isOpen={isFormOpen}
        callback={(formID: string, method: string, action: string) => {
          setLayout([
            ...layout,
            {
              i: "timer" + sessionStorage.getItem("count"),
              x: 0,
              y: 0,
              w: 100,
              h: 2,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([
            ...layoutProps,
            { id: formID, action: action, method: method },
          ]);
        }}
      /> */}

      <OptionsModal
        onClose={onOptionsClose}
        elementID={layoutProps[selectedElement as number]?.id || ""}
        link={layoutProps[selectedElement as number]?.link || ""}
        visibility={
          layoutProps[selectedElement as number]?.visibility || "block"
        }
        isOpen={isOptionsOpen}
        callback={(elementID: string, link: string, visibility: string) => {
          const s = selectedElement as number;
          if (elementID !== undefined) {
            layoutProps[s].id = elementID;
          }

          if (link !== undefined) {
            layoutProps[s].link = link;
          }

          if (visibility !== undefined) {
            layoutProps[s].visibility = visibility;
          }

          setLayoutProps([...layoutProps]);
          IDManager.addID(layout[s].i, elementID);
        }}
      />
    </>
  );
}
