import { addFavoriteCourse } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { new_favorite_list, user_id } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(user_id) || !assertNotNil(new_favorite_list)) {
      res.status(400).json({ error: "Missing user_id" });
    } else {
      const user_data = await addFavoriteCourse(
        accessToken,
        new_favorite_list,
        user_id
      );
      return res.status(200).json(user_data);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error?.code ?? error.message });
  }
});
