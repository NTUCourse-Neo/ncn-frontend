import { deleteUserProfile } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    await deleteUserProfile(accessToken);
    return res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error?.code ?? error.message });
  }
});
