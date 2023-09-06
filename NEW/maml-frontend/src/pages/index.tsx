import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MAMLLayout from "@/components/MAMLLayout";

import { useState } from "react";

export default function Home() {
  const [enableOverlaps, setEnableOverlaps] = useState<boolean>(false);

  return (
    <>
      {/* Header */}
      <Header
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
          <MAMLLayout enableOverlaps={enableOverlaps} />
        </GridItem>

        {/* Right Menu Bar */}
        <GridItem bgColor="white" p="1rem">
          <FontAwesomeIcon width="15px" color="#B0B0B0" icon={faBars} />
        </GridItem>
      </Grid>
    </>
  );
}
