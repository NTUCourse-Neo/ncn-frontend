import { getNTURatingData } from "queries/course";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CourseRatingData } from "types/course";
import axios from "axios";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    course_id: string | null;
    course_rating: CourseRatingData | null;
    update_ts: string | null;
    message: string;
  }>
) {
  try {
    const { courseId } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(courseId) || !accessToken) {
      res.status(400).json({
        course_id: null,
        course_rating: null,
        update_ts: null,
        message: "Missing user_id",
      });
    } else {
      const data = await getNTURatingData(accessToken, courseId);
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res.status(500).json({
        course_id: null,
        course_rating: null,
        update_ts: null,
        message: error?.code ?? error.message,
      });
    } else {
      res.status(500).json({
        course_id: null,
        course_rating: null,
        update_ts: null,
        message: "Error occur in getRatingData",
      });
    }
  }
});
