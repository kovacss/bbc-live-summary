// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BBCClient, CommentaryType } from '../../clients/bbc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentaryType[]>
) {
  const query = req.query['live'];
  if (!query) {
    res.status(400);
    return;
  }
  const result = await BBCClient.get(Array.isArray(query) ? query[0] : query);
  // res.setHeader('cache-control', 'public, s-maxage=1200, stale-while-revalidate=600')
  res.status(200).json(result)
}
