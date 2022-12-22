import { Flex } from "@chakra-ui/react";

import { CommentaryType } from "../clients/bbc";
import Commentary from "./commentary";

function getMostLiked(commentaries: CommentaryType[]): CommentaryType {
  return commentaries.sort((a, b) => b.reaction.liked - a.reaction.liked)[0];
}

function getMostDisliked(commentaries: CommentaryType[]): CommentaryType {
  return commentaries.sort(
    (a, b) => b.reaction.disliked - a.reaction.disliked
  )[0];
}

export default function Highlights(props: { commentaries: CommentaryType[] }) {
  const top = getMostLiked(props.commentaries);
  const flop = getMostDisliked(props.commentaries);

  return (
    <Flex direction={"column"} alignItems={"center"} justifyContent="center">
      <Commentary commentary={top} type="liked" />
      <Commentary commentary={flop} type="disliked" />
    </Flex>
  );
}
