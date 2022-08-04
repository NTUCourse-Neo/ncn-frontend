import { createSocialPost } from "queries/social";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
  }>
) {
  try {
    const { courseId, post } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(courseId) || !assertNotNil(post) || !accessToken) {
      res.status(400).json({ message: "Missing user_id" });
    } else {
      await createSocialPost(accessToken, courseId, post);
      return res.status(200).json({
        message: "Post created successfully",
      });
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res.status(500).json({ message: error?.code ?? error.message });
    } else {
      res.status(500).json({ message: "Error occur in deleteSocialPost" });
    }
  }
});
