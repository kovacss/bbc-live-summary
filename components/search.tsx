import {
  Box,
  Flex,
  Input,
  InputGroup,
  IconButton,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FormEvent } from "react";

type SearchProps = {
  onSearch: (query: string) => void;
};

export default function Search({ onSearch }: SearchProps) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };

    const searchedTerm = target.search.value;
    onSearch(searchedTerm);
  };

  return (
    <Box w="100%">
      <form onSubmit={onSubmit}>
        <Flex>
          <InputGroup>
            <Input
              name="search"
              placeholder="https://www.bbc.com/sport/live/formula1/58920213"
              _placeholder={{ opacity: 1, color: "gray.500" }}
              backgroundColor={"white"}
            />
            <InputRightElement>
              <IconButton
                aria-label="Search database"
                icon={<SearchIcon />}
                type="submit"
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
      </form>
    </Box>
  );
}
