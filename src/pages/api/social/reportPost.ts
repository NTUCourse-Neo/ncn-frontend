import { reportSocialPost } from "queries/social";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    const { post_id, content } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(post_id) || !assertNotNil(content)) {
      res.status(400).json({ message: "Missing user_id" });
    } else {
      await reportSocialPost(accessToken, post_id, {
        reason: content,
      });
      return res.status(200).json({ message: "Post reported successfully" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error?.code ?? error.message });
  }
});
