import { registerNewUser } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@/types/user";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: User; message: string }>
) {
  try {
    const { email } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(email)) {
      res.status(400).json({ user: null, message: "Missing user_id" });
    } else {
      const userData = await registerNewUser(accessToken, email);
      return res.status(200).json(userData);
    }
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ user: null, message: error?.code ?? error.message });
  }
});
