import { removeFavoriteCourse } from "queries/user";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { assertNotNil } from "utils/assert";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Course } from "types/course";
import axios from "axios";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    favorites: Course[];
    message: string;
  }>
) {
  try {
    const { course_id } = req.body;
    const { accessToken } = await getAccessToken(req, res);
    if (!assertNotNil(course_id) || !accessToken) {
      res.status(400).json({ favorites: [], message: "Missing course_id" });
    } else {
      const updatedFavoriteListData = await removeFavoriteCourse(
        accessToken,
        course_id
      );
      return res.status(200).json(updatedFavoriteListData);
    }
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res
        .status(500)
        .json({ favorites: [], message: error?.code ?? error.message });
    } else {
      res.status(500).json({
        favorites: [],
        message: "Error occur in removeFavoriteCourse",
      });
    }
  }
});
