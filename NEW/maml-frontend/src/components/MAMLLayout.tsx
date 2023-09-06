import { Box, Flex, Button, Text } from "@chakra-ui/react";
import GridLayout from "react-grid-layout";
import { useEffect, useState } from "react";
import TextItem from "./layoutItems/TextItem";
import { useDisclosure } from "@chakra-ui/react";
import ShapeSelectorModal from "./modals/ShapeSelectorModal";
import ImageUploaderModal from "./modals/ImageUploaderModal";
import { IUploadedImage } from "@/utils/types";
import DropdownModal from "./modals/DropdownModal";
import TimerModal from "./modals/TimerModal";
import VideoURLModal from "./modals/VideoURLModal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

interface Props {
  enableOverlaps: boolean;
}

export default function MAMLLayout(props: Props) {
  const [layout, setLayout] = useState<GridLayout.Layout[]>([]);
  const [layoutProps, setLayoutProps] = useState<any[]>([]);

  const [carousel, setCarousel] = useState<boolean>(false);

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

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { dataTransfer, clientX, clientY } = e;
    const component = dataTransfer.getData("component");

    if (component.replace(/\d/g, "") === "shape") {
      onShapeSelectorOpen();
      return;
    } else if (component.replace(/\d/g, "") === "image") {
      setCarousel(false);
      onImageUploaderOpen();
      return;
    } else if (component.replace(/\d/g, "") === "dropdown") {
      onDropdownOpen();
      return;
    } else if (component.replace(/\d/g, "") === "timer") {
      onTimerOpen();
      return;
    } else if (component.replace(/\d/g, "") === "video") {
      onVideoUrlOpen();
      return;
    } else if (component.replace(/\d/g, "") === "carousel") {
      setCarousel(true);
      onImageUploaderOpen();
      return;
    }

    setLayout([
      ...layout,
      { i: component, x: 0, y: 0, w: 5, h: 2, minW: 2, minH: 1 },
    ]);

    setLayoutProps([...layoutProps, {}]);
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
  };

  const generateComponent = (layoutItem: any) => {
    let component: JSX.Element = <></>;
    const index = layout.indexOf(layoutItem);

    switch (layoutItem.i.replace(/\d/g, "")) {
      case "text":
        component = (
          <TextItem
            layoutProps={layoutProps}
            index={index}
            setLayoutProps={setLayoutProps}
          ></TextItem>
        );
        break;
      case "image":
        component = (
          <img
            src={layoutProps[index][0].thumbnail}
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
            {layoutProps[index].map((image: IUploadedImage, idx: number) => (
              <img
                key={idx}
                src={image.thumbnail}
                alt="Image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ))}
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
            <TextItem
              initialText="Button"
              layoutProps={layoutProps}
              index={index}
              setLayoutProps={setLayoutProps}
            ></TextItem>
          </Button>
        );
        break;

      case "text-field":
        component = (
          <input
            type="text"
            placeholder="Edit Placeholder"
            style={{ width: "100%", height: "100%" }}
          />
        );
        break;

      case "dropdown":
        component = (
          <select
            style={{ border: "solid 1px #ccc", width: "100%", height: "100%" }}
          >
            {layoutProps[index].options.map((_option: string) => (
              <option>{_option}</option>
            ))}
          </select>
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
            src={layoutProps[index].url}
            width="100%"
            height="100%"
            controls
            autoPlay={layoutProps[index].autoplay}
          ></video>
        );
        break;
    }

    return (
      <div
        key={layoutItem.i}
        style={{
          border: "1px solid #ccc",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            lineHeight: "16px",
            cursor: "pointer",
            zIndex: 1,
          }}
          onClick={deleteItem(layoutItem.i)}
        >
          &times;
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
          height="800px"
          bg="white"
          margin="1rem"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <GridLayout
            className="layout"
            layout={layout as GridLayout.Layout[]}
            cols={60}
            rowHeight={30}
            width={1200}
            compactType={null}
            allowOverlap={props.enableOverlaps}
            onLayoutChange={(layout: any) => {
              setLayout(layout);
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
              w: 5,
              h: 2,
              minW: 2,
              minH: 1,
            },
          ]);
          setLayoutProps([...layoutProps, { backgroundColor: color }]);
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
              w: 5,
              h: 2,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([...layoutProps, value]);
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
              w: 5,
              h: 2,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([...layoutProps, { options: options }]);
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
              w: 5,
              h: 2,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([...layoutProps, { start: start, end: end }]);
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
              w: 10,
              h: 3,
              minW: 2,
              minH: 1,
            },
          ]);

          setLayoutProps([...layoutProps, { url: url, autoplay: autoplay }]);
        }}
      />
    </>
  );
}
