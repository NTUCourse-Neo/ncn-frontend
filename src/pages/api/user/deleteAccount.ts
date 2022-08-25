import { deleteUserAccount } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    if (!accessToken) {
      res.status(400).json({ message: "Missing accessToken" });
    } else {
      await deleteUserAccount(accessToken);
      return res.status(200).json({ message: "Account deleted" });
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res.status(500).json({ message: error?.code ?? error.message });
    } else {
      res.status(500).json({
        message: "Error occur in deleteAccount",
      });
    }
  }
});
