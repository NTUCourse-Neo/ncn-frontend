import { addFavoriteCourse } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { course_id } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(course_id)) {
      res.status(400).json({ error: "Missing course_id" });
    } else {
      const updatedFavoriteListData = await addFavoriteCourse(
        accessToken,
        course_id
      );
      return res.status(200).json(updatedFavoriteListData);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error?.code ?? error.message });
  }
});
