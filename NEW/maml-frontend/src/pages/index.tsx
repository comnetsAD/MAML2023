import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Box, Button, Flex, Grid, GridItem, HStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBomb,
  faBars,
  faDatabase,
  faEye,
  faTextWidth,
  faImages,
  faHandDots,
  faShapes,
  faImage,
  faServer,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>MAML Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        p={".7rem 1rem"}
        direction="row"
        alignItems="center"
        justify="space-between"
        borderBottom="solid 2px #E9E9E9"
      >
        <Flex direction="row" alignItems="center">
          <FontAwesomeIcon icon={faBomb} width="25px" color="#4A8CCE" />
          <HStack spacing="30px" paddingLeft={"2rem"}>
            <span>File</span>
            <span>View</span>
            <span>Help</span>
          </HStack>
        </Flex>

        <Flex direction="row" alignItems="center">
          <Button
            size={"sm"}
            padding={"0 1.2rem"}
            bg={"primary"}
            color={"white"}
            _hover={{ bg: "secondary" }}
            borderRadius={"30px"}
            leftIcon={<FontAwesomeIcon icon={faDatabase} width={"10px"} />}
          >
            Databases
          </Button>
          <Button
            size={"sm"}
            padding={"0 1.2rem"}
            marginLeft={".5rem"}
            bg={"primary"}
            color={"white"}
            _hover={{ bg: "secondary" }}
            borderRadius={"30px"}
            leftIcon={<FontAwesomeIcon icon={faEye} width={"14px"} />}
          >
            Live Preview
          </Button>

          <Image
            src="/ayush.jpg"
            alt="User Avatar"
            width={30}
            height={30}
            style={{ borderRadius: "50%", marginLeft: ".5rem" }}
          />
        </Flex>
      </Flex>

      <Grid
        gridTemplateColumns="min-content 1fr min-content"
        bgColor="#E2E7E9"
        minHeight="100vh"
      >
        <GridItem bgColor="white" p="1rem">
          <Flex direction="column" alignItems="center" gap={10}>
            <FontAwesomeIcon width="17px" color="#787878" icon={faTextWidth} />
            <FontAwesomeIcon width="17px" color="#787878" icon={faImages} />
            <FontAwesomeIcon width="17px" color="#787878" icon={faHandDots} />
            <FontAwesomeIcon width="17px" color="#787878" icon={faShapes} />
            <FontAwesomeIcon width="17px" color="#787878" icon={faImage} />
            <FontAwesomeIcon width="17px" color="#787878" icon={faServer} />
            <FontAwesomeIcon width="17px" color="#787878" icon={faSearch} />
          </Flex>
        </GridItem>
        <Flex direction="row" alignItems={"center"} justifyContent={"center"}>
          <Box width="65%" height="80vh" bg="white" margin="3rem"></Box>
        </Flex>
        <GridItem bgColor="white" p="1rem">
          <FontAwesomeIcon width="15px" color="#B0B0B0" icon={faBars} />
        </GridItem>
      </Grid>
    </>
  );
}
