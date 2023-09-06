import Head from "next/head";
import { Button, Flex, HStack, Switch } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb, faDatabase, faEye } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface Props {
  enableOverlaps: boolean;
  setEnableOverlaps: Function;
}

export default function Header(props: Props) {
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
          <span style={{ marginRight: ".8rem" }}>Allow Overlaps</span>
          <Switch
            isChecked={props.enableOverlaps}
            onChange={() => {
              props.setEnableOverlaps(!props.enableOverlaps);
            }}
            style={{ marginRight: "1rem" }}
          />
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
    </>
  );
}
