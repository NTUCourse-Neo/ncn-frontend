import { getPTTData } from "queries/course";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { courseId, type } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (
      !assertNotNil(courseId) ||
      !assertNotNil(type) ||
      !["review", "exam"].includes(type)
    ) {
      res.status(400).json({ error: "Missing/Wrong user_id" });
    } else {
      const data = await getPTTData(accessToken, courseId, type);
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error?.code ?? error.message });
  }
});
