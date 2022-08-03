import { getCourseEnrollInfo } from "queries/course";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CourseEnrollStatus } from "@/types/course";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    course_id: string;
    course_status: CourseEnrollStatus | null;
    update_ts: string;
    message: string;
  }>
) {
  try {
    const { courseId } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(courseId)) {
      res.status(400).json({
        course_id: null,
        course_status: null,
        update_ts: null,
        message: "Missing user_id",
      });
    } else {
      const data = await getCourseEnrollInfo(accessToken, courseId);
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      course_id: null,
      course_status: null,
      update_ts: null,
      message: error?.code ?? error.message,
    });
  }
});
