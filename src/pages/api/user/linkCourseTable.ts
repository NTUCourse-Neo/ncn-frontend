import { linkCoursetableToUser } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "types/user";
import axios from "axios";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: User | null; message: string }>
) {
  try {
    const { table_id, user_id } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(user_id) || !assertNotNil(table_id) || !accessToken) {
      res.status(400).json({ user: null, message: "Missing user_id" });
    } else {
      const user_data = await linkCoursetableToUser(
        accessToken,
        table_id,
        user_id
      );
      return res.status(200).json(user_data);
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res
        .status(500)
        .json({ user: null, message: error?.code ?? error.message });
    } else {
      res.status(500).json({
        user: null,
        message: "Error occur in linkCourseTable",
      });
    }
  }
});
