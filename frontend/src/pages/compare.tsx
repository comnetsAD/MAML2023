import React, { Context } from "react";
import { Flex, Box, Heading, Divider } from "@chakra-ui/react";
import { NextPageContext } from "next";
import Head from "next/head";
interface Props {
  previewURL: string;
  htmlContent: string;
}

const Compare = ({ previewURL, htmlContent }: Props) => {
  return (
    <>
      <Head>
        <title>Compare</title>
      </Head>
      <Flex justifyContent={"stretch"} height={"100vh"}>
        <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
          <Heading
            as="h2"
            size="md"
            textAlign="center"
            p="4"
            background={"gray.200"}
          >
            Assigned Webpage
          </Heading>
          <iframe
            src={previewURL}
            title="External Website"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </Box>
        <Divider orientation="vertical" />
        <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
          <Heading
            as="h2"
            size="md"
            textAlign="center"
            p="4"
            background={"gray.300"}
          >
            Your Design
          </Heading>
          <iframe
            src={htmlContent}
            title="Your Design"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </Box>
      </Flex>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const query = context.query;

  if (!query.previewURL || !query.htmlContent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      previewURL: query.previewURL as string,
      htmlContent: query.htmlContent as string,
    },
  };
}

export default Compare;
