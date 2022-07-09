import { getCourseEnrollInfo } from "queries/course";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { courseId } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(courseId)) {
      res.status(400).json({ error: "Missing user_id" });
    } else {
      const data = await getCourseEnrollInfo(accessToken, courseId);
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error?.code ?? error.message });
  }
});
