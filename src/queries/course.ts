import instance from "@/queries/axiosInstance";
import type { SearchFieldName, Filter } from "@/types/search";
import type {
  Course,
  CourseEnrollStatus,
  CourseRatingData,
  PTTData,
  CourseSyllabus,
} from "types/course";
const api_version = "v2";

type NullableSearchFilterBase = {
  [P in keyof Filter]: Filter[P] | null;
};

export interface NullableSearchFilter extends NullableSearchFilterBase {
  strict_match: boolean;
}

export const fetchSearchResult = async (
  searchString: string,
  fields: SearchFieldName[],
  filter_obj: NullableSearchFilter,
  batchSize: number,
  offset: number,
  semester: string
) => {
  const { data } = await instance.post(`${api_version}/courses/search`, {
    keyword: searchString,
    fields: fields,
    filter: filter_obj,
    batch_size: batchSize,
    offset: offset,
    semester: semester,
  });
  return data as {
    courses: Course[];
    total_count: number;
  };
};

export const fetchCourse = async (id: string) => {
  const { data } = await instance.get(`${api_version}/courses/${id}`);
  return data as {
    course: Course;
    message: string;
  };
};

export const getCourseEnrollInfo = async (token: string, course_id: string) => {
  const { data } = await instance.get(
    `${api_version}/courses/${course_id}/enrollinfo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    course_id: string;
    course_status: CourseEnrollStatus | null;
    update_ts: string;
    message: string;
  };
};

export const getNTURatingData = async (token: string, course_id: string) => {
  const { data } = await instance.get(
    `${api_version}/courses/${course_id}/rating`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    course_id: string;
    course_rating: CourseRatingData | null;
    update_ts: string;
    message: string;
  };
};

type PTTRequestType = "review" | "exam";
export const getPTTData = async (
  token: string,
  course_id: string,
  type: PTTRequestType
) => {
  const { data } = await instance.get(
    `${api_version}/courses/${course_id}/ptt/${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    course_id: string;
    course_rating: PTTData | null;
    update_ts: string;
    message: string;
  };
};

export const getCourseSyllabusData = async (course_id: string) => {
  const { data } = await instance.get(
    `${api_version}/courses/${course_id}/syllabus`
  );
  return data as {
    course_id: string;
    course_syllabus: CourseSyllabus | null;
    update_ts: string;
    message: string;
  };
};
