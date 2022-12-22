import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Commentary from "../../components/commentary";

describe("Commentary", () => {
  const commentary = {
    reaction: {
      liked: 42,
      disliked: 54,
    },
    title: "Generic Title",
    dateAdded: new Date().toISOString(),
    assetId: "SomeId",
    link: "https://bbc.co.uk",
  };

  it("renders title", async () => {
    render(<Commentary commentary={commentary} type={"liked"} />);

    const title = await screen.findByText(commentary.title);
    expect(title).toBeVisible();
  });

  describe("Type Prop", () => {
    it("shows liked", async () => {
      render(<Commentary commentary={commentary} type={"liked"} />);

      const likedCount = await screen.findByText(commentary.reaction.liked);
      expect(likedCount).toBeVisible();
    });

    it("shows disliked", async () => {
      render(<Commentary commentary={commentary} type={"disliked"} />);

      const dislikedCount = await screen.findByText(
        commentary.reaction.disliked
      );
      expect(dislikedCount).toBeVisible();
    });
  });
});
