"use client";

import { useEffect, useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Search from "../components/search";
import Highlights from "../components/highlights";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};
export default function Home({ searchParams }: PageProps) {
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const loadAPI = async () => {
      const res = await window.fetch(`api/live?live=${searchParams!.live}`);
      const jsonRes = await res.json();
      setResponse(jsonRes);
    };

    loadAPI();
  }, [setResponse, searchParams]);

  const onSearch = (query: string) => {
    const searchParam = parseQuery(query);
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("live", searchParam);
    window.location.search = searchParams.toString();
  };

  return (
    <div>
        <Box backgroundColor={"bbc.900"} padding="3" as="header" marginBottom={10}>
          <Flex
            direction={["column", "row"]}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Heading
              size="md"
              color={"white"}
              textAlign={"center"}
              marginRight="5"
            >
              BBC Live Highlights
            </Heading>
            <Search onSearch={onSearch} />
          </Flex>
        </Box>
      <Flex
        flexDirection="column"
        alignItems={"center"}
        justifyContent="center"
      >
        <Box w="75%">
          <Box textAlign={"center"}>
            Simpy lookup most voted and downvoted commentary from a BBC Live
            feed
          </Box>
          {response ? <Highlights commentaries={response} /> : null}
        </Box>
      </Flex>
    </div>
  );
}

function parseQuery(query: string): string {
  // Assume it's a full URL
  if (query.includes("bbc.com")) {
    const url = new URL(query);
    return query.substring(url.origin.length);
  }
  if (query.startsWith("/")) {
    return "/" + query;
  }
  return query;
}
