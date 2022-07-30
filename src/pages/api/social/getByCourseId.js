import { getSocialPostByCourseId } from "queries/social";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { course_id } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(course_id)) {
      res.status(400).json({ error: "Missing user_id" });
    } else {
      const post_data = await getSocialPostByCourseId(accessToken, course_id);
      return res.status(200).json(post_data);
    }
  } catch (error) {
    if (error?.response?.status === 404) {
      return res.status(200).json({ posts: [] });
    } else {
      console.error(error);
      res
        .status(error.status || 500)
        .json({ msg: error?.code ?? error.message });
    }
  }
});
