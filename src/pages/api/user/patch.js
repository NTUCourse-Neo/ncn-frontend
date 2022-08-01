import { patchUserInfo } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { newUser } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(newUser)) {
      res.status(400).json({ error: "Missing user_id" });
    } else {
      const userData = await patchUserInfo(accessToken, newUser);
      return res.status(200).json(userData);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error?.code ?? error.message });
  }
});
