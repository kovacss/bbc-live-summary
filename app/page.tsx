"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  List,
  ListItem,
  Link,
} from "@chakra-ui/react";
import Search from "../components/search";
import Highlights from "../components/highlights";
import { LinkIcon } from "@chakra-ui/icons";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};
export default function Home({ searchParams }: PageProps) {
  const [response, setResponse] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const hasSetup = useMemo(
    () => typeof searchParams!.live != "undefined",
    [searchParams]
  );
  useEffect(() => {
    // TODO handle errors, maybe use https://codepen.io/nijinvinodan/pen/VvjBxX for the nice animation / icon
    const loadAPI = async () => {
      setLoading(true);
      setError(false);
      const res = await window.fetch(`api/live?live=${searchParams!.live}`);
      const jsonRes = await res.json();
      if (jsonRes.length == 0) {
        setError(true);
      } else {
        setResponse(jsonRes);
      }
      setLoading(false);
    };

    if (hasSetup) {
      loadAPI();
    }
  }, [hasSetup, setResponse, searchParams]);

  const onSearch = (query: string) => {
    const searchParam = parseQuery(query);
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("live", searchParam);
    window.location.search = searchParams.toString();
  };

  return (
    <div>
      <Box
        backgroundColor={"bbc.900"}
        padding="3"
        as="header"
        marginBottom={10}
      >
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
            <Link href="/">BBC Live Highlights</Link>
          </Heading>
          {hasSetup ? <Search onSearch={onSearch} /> : null}
          <Link href="https://github.com/kovacss/bbc-live-summary">
            <svg width="24" height="24" viewBox="0 0 33 33">
              <title>Github Link</title>
              <path
                d="M16.6.46C7.6.46.33 7.76.33 16.76c0 7.17 4.67 13.3 11.14 15.43.8.1 1.1-.4 1.1-.8v-2.8c-4.54.9-5.5-2.2-5.5-2.2-.74-1.9-1.8-2.4-1.8-2.4-1.48-1 .1-1 .1-1 1.64.1 2.5 1.7 2.5 1.7 1.45 2.4 3.8 1.7 4.74 1.3.2-1.1.6-1.8 1.1-2.2-3.6-.4-7.4-1.8-7.4-8.1 0-1.8.7-3.28 1.7-4.4-.1-.4-.7-2.1.2-4.3 0 0 1.4-.48 4.5 1.63 1.3-.36 2.7-.54 4.1-.55 1.4 0 2.8.2 4.1.57 3.1-2.1 4.48-1.7 4.48-1.7.9 2.24.33 3.9.17 4.3 1 1.2 1.6 2.64 1.6 4.44 0 6.23-3.8 7.6-7.43 8 .6.5 1.1 1.5 1.1 3.04v4.47c0 .43.27.94 1.1.8 6.45-2.1 11.1-8.2 11.1-15.4 0-9-7.3-16.3-16.3-16.3"
                fill="#FFFFFF"
              ></path>
            </svg>
          </Link>
        </Flex>
      </Box>
      <Flex
        flexDirection="column"
        alignItems={"center"}
        justifyContent="center"
      >
        <Box w="75%">
          {error ? (
            <Box color={"red.500"}>
              <div className="errorModule">
                <div className="errorIcon">
                  <LinkIcon />
                </div>
                <div>
                  Oops! Something went Wrong. Please verify the link you used
                  and try Again.
                </div>
              </div>
            </Box>
          ) : (
            <Heading textAlign={"center"} size="md">
              Simpy lookup most voted and downvoted commentary from a BBC Live
              feed
            </Heading>
          )}
          {!hasSetup ? <Showcase onSearch={onSearch} /> : null}
          {response ? <Highlights commentaries={response} /> : null}
        </Box>
      </Flex>
    </div>
  );
}

function Showcase(props: { onSearch: (query: string) => void }) {
  return (
    <Box marginTop={10} textAlign="center">
      <Box marginTop={"4"}>Paste a live BBC link in the search bar below:</Box>
      <Search onSearch={props.onSearch} />
      <Box marginTop={"4"}>OR</Box>
      <Box marginTop={"4"}>Start browsing some examples:</Box>
      <List spacing={3} marginTop="2">
        <ListItem>
          <Link href="?live=/sport/live/football/61047899">
            ⚽ World Cup 2022 Final
          </Link>
        </ListItem>
        <ListItem>
          <Link href="?live=/sport/live/formula1/58920219">
            🏎️ Formula 1 Abu Dhabi Race
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}

function parseQuery(query: string): string {
  // Assume it's a full URL
  if (query.includes("bbc.com")) {
    const url = new URL(query);
    return query.substring(url.origin.length);
  }
  if (!query.startsWith("/")) {
    return "/" + query;
  }
  return query;
}
