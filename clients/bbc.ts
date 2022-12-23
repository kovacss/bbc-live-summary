// https://push.api.bbci.co.uk/batch?t=%2Fdata%2Fbbc-morph-%7Blx-commentary-data-paged%2FassetUri%2F%252Fsport%252Flive%252Fformula1%252F58920213%2FisUk%2Ffalse%2Flimit%2F20%2FnitroKey%2Flx-nitro%2FpageNumber%2F1%2FserviceName%2Fnews%2Fversion%2F1.5.6%2Clx-stream-reaction-counts-data%2FassetUri%2F%252Fsport%252Flive%252Fformula1%252F58920213%2FisUk%2Ffalse%2Flimit%2F50%2FnitroKey%2Flx-nitro%2FpageNumber%2F1%2Fversion%2F2.0.17%7D
// /data/bbc-morph-{lx-commentary-data-paged/assetUri/%2Fsport%2Flive%2Fformula1%2F58920213/isUk/false/limit/20/nitroKey/lx-nitro/pageNumber/1/serviceName/news/version/1.5.6,lx-stream-reaction-counts-data/assetUri/%2Fsport%2Flive%2Fformula1%2F58920213/isUk/false/limit/50/nitroKey/lx-nitro/pageNumber/1/version/2.0.17}

const BASE_URI = "https://push.api.bbci.co.uk";

type AssetId = string;

type Reaction = { liked: number; disliked: number };

type ReactionBody = {
  postReactions: { [key: AssetId]: Reaction };
};

type CommentaryBody = {
  results: [{ assetId: AssetId; title: string; dateAdded: string, locator: string }];
};

type BaseBody = {
    numberOfPages: number
}

type SingleResponse = {
  meta: {
    responseCode: number;
    template: string;
  };
  body: (ReactionBody | CommentaryBody) & BaseBody;
};

type BBCResponse = {
  meta: unknown;
  payload: SingleResponse[];
};

const COMMENTARY_QUERY = "lx-commentary-data-paged";
const REACTION_QUERY = "lx-stream-reaction-counts-data";

export const BBCClient = {
  get: async (resource: string) => {
    const liveID = resource;
    const encodedResource = encodeURIComponent(liveID);
    const finalURL = getPageURL(encodedResource, 1);
    const response = await fetch(finalURL);
    const data: BBCResponse = await response.json();

    const numberOfPages = data.payload[0].body.numberOfPages;
    let payload: SingleResponse[] = data.payload;

    // If more than one page, get comments for all remaining pages
    if (numberOfPages > 1) {
        await Promise.all(Array.from({ length: numberOfPages - 1 }).map(async (_, idx) => {
            const finalURL = getPageURL(encodedResource, idx + 2);
            const response = await fetch(finalURL);
            const data: BBCResponse = await response.json();
            payload.push(...data.payload);
        }));
    }

    const commentaries = mergeReactionAndCommentary(data.payload, liveID);
    
    return commentaries;
  },
};

function getPageURL(encodedResource: string, pageNumber: number) {
    const commentaryResource = `${COMMENTARY_QUERY}/assetUri/${encodedResource}/isUk/false/limit/20/nitroKey/lx-nitro/pageNumber/${pageNumber}/serviceName/news/version/1.5.6`;
    const reactionResource = `${REACTION_QUERY}/assetUri/${encodedResource}/isUk/false/limit/20/nitroKey/lx-nitro/pageNumber/${pageNumber}/version/2.0.17`;
    const url = `/data/bbc-morph-{${commentaryResource},${reactionResource}}`;
    return `${BASE_URI}/batch?t=${encodeURIComponent(url)}`;
}

export type CommentaryType = {
  reaction: Reaction;
  title: string;
  dateAdded: string;
  assetId: AssetId;
  link: string;
};

function mergeReactionAndCommentary(
  payload: SingleResponse[],
  liveId: string
): CommentaryType[] {
  const comments = payload
    .filter((x) => x.meta.template.includes(COMMENTARY_QUERY))
    .map((x) => (x.body as CommentaryBody).results)
    .flatMap((x) => x);

  const reactions = payload
    .filter((x) => x.meta.template.includes(REACTION_QUERY))
    .map((x) => (x.body as ReactionBody).postReactions);

  const allReactions: { [key: AssetId]: { liked: number; disliked: number } } =
    Object.assign({}, {}, ...reactions);

  return comments.map((c) => {
    return {
      reaction: allReactions[c.assetId],
      link: `https://www.bbc.com${liveId}?pinned_post_locator=${c.locator}`,
      ...c,
    };
  });
}
