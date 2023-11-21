import { Box, Flex, Grid, GridItem, Text, Textarea } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MAMLLayout from "@/components/MAMLLayout";

import { useState } from "react";
import { colors } from "./_app";
import GridLayout from "react-grid-layout";

export default function Home() {
  const [enableOverlaps, setEnableOverlaps] = useState<boolean>(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState<boolean>(false);

  const [mamlCode, setMAMLCode] = useState<string>("");
  const [data, setData] = useState<any>({});

  const handleData = (layout: GridLayout.Layout[], props: any[]) => {
    setData({ layout, props });
  };

  return (
    <>
      {/* Header */}
      <Header
        data={data}
        mamlCode={mamlCode}
        enableOverlaps={enableOverlaps}
        setEnableOverlaps={setEnableOverlaps}
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
          <MAMLLayout enableOverlaps={enableOverlaps} callback={handleData} />
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
            <div style={{ overflowY: "auto" }}>
              <Text fontSize={"20px"} fontWeight={"bold"} marginTop={"2rem"}>
                Interactivity Code Editor
              </Text>
              <Text>
                Use this editor to write code for interactivity.
                <br />
                <a
                  href="#"
                  style={{ textDecoration: "underline", color: colors.primary }}
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
                marginTop={"1rem"}
              />
            </div>
          )}
        </GridItem>
      </Grid>
    </>
  );
}
