import { Box, Flex, Grid, GridItem, Text, Textarea } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MAMLLayout from "@/components/MAMLLayout";

import { useEffect, useState } from "react";
import { colors } from "./_app";
import GridLayout from "react-grid-layout";

import DraggableList from "@/components/DraggableList";

export default function Home() {
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState<boolean>(false);

  const [mamlCode, setMAMLCode] = useState<string>("");
  const [data, setData] = useState<any>({});

  const handleData = (layout: GridLayout.Layout[], props: any[]) => {
    setData({ layout, props });
  };

  const handleMAMLCode = (code: string) => {
    setMAMLCode(code);
  };

  const [importedData, setImportedData] = useState<Object[]>([]);

  const handleImport = (data: Object[]) => {
    setImportedData(data);
  };

  return (
    <>
      {/* Header */}
      <Header
        handleImport={handleImport}
        data={data}
        mamlCode={mamlCode}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
      />

      {/* Main Grid */}
      <Grid
        gridTemplateColumns="min-content 1fr min-content"
        bgColor="#E2E7E9"
        minHeight="100vh"
      >
        {/* Sidebar */}
        <GridItem bgColor="white" p="1rem">
          <Sidebar />
        </GridItem>

        {/* Editor Layout */}
        <GridItem>
          <MAMLLayout
            importedData={importedData}
            showOptions={showOptions}
            callback={handleData}
          />
        </GridItem>

        {/* Right Menu Bar */}
        <GridItem bgColor="white" p="1rem">
          <FontAwesomeIcon
            width="15px"
            color="#B0B0B0"
            icon={faBars}
            cursor={"pointer"}
            onClick={() => {
              setIsCodeEditorOpen(!isCodeEditorOpen);
            }}
          />

          {isCodeEditorOpen && (
            <>
              <DraggableList callback={handleMAMLCode} />
              {/* <div style={{ overflowY: "auto" }}>
                <Text fontSize={"20px"} fontWeight={"bold"} marginTop={"2rem"}>
                  MAMLScript Editor
                </Text>
                <Text>
                  Use this editor to write MAMLScript for interactivity.
                  <br />
                  <a
                    href="#"
                    style={{
                      textDecoration: "underline",
                      color: colors.primary,
                    }}
                  >
                    See documentation
                  </a>
                </Text>
                <Textarea
                  placeholder="Write Code"
                  size="sm"
                  value={mamlCode}
                  onChange={(e) => setMAMLCode(e.target.value)}
                  resize={"vertical"}
                  minWidth={"400px"}
                  minHeight={"200px"}
                  marginTop={"1rem"}
                />
              </div> */}
            </>
          )}
        </GridItem>
      </Grid>
    </>
  );
}
