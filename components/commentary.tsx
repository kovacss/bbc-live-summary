import {
  Card,
  CardBody,
  Flex,
  Heading,
  Center,
  Box,
  Link
} from "@chakra-ui/react";
import Image from "next/image";
import ThumbsUp from "../public/thumbs-up.svg";
import ThumbsDown from "../public/thumbs-down.svg";
import { CommentaryType } from "../clients/bbc";

type CommentaryProps = {
  commentary: CommentaryType;
  type: "liked" | "disliked";
};

export default function Commentary({ commentary, type }: CommentaryProps) {
  const voteSummary =
    type == "liked" ? (
      <>
        {" "}
        <Image width="24" height="24" alt="thumbs-up" src={ThumbsUp} />
        <p style={{ marginLeft: "5px" }}>{commentary.reaction.liked}</p>
      </>
    ) : (
      <>
        <Image width="24" height="24" alt="thumbs-down" src={ThumbsDown} />
        <p style={{ marginLeft: "5px" }}>{commentary.reaction.disliked}</p>
      </>
    );

  // const body = (commentary as any).body.filter((el: any) => el.type === 'paragraph').map((el: any) => {

  // });
  return (
      <Card margin={"10px"} width="95%" backgroundColor={type == "liked" ? "green.100" : "red.100"}>
        <CardBody>
          <Flex alignItems={"center"} padding={"10px"}>
            <Center w="80px" marginRight={"2"}>{voteSummary}</Center>
            <Box flex="1">
              <Heading as="h4" size="md">
                {commentary.title}
              </Heading>
            </Box>
          </Flex>
          <Box textAlign={"end"} fontSize={"sm"}><Link href={commentary.link} isExternal>Original Comment</Link> - {new Date(commentary.dateAdded).toLocaleString()}</Box>
        </CardBody>
      </Card>
  );
}
