import instance from "@/queries/axiosInstance";
import type { SearchFieldName, FilterEnable, Filter } from "@/types/search";
import type {
  Course,
  CourseEnrollStatus,
  CourseRatingData,
  PTTData,
  CourseSyllabus,
} from "types/course";
const api_version = "v2";

export const fetchSearchResult = async (
  searchString: string,
  fields: SearchFieldName[],
  filters_enable: FilterEnable,
  filter_obj: Filter,
  batchSize: number,
  offset: number,
  semester: string,
  strict_match_bool: boolean
) => {
  const filter = {
    time: filters_enable.time ? filter_obj.time : null,
    department:
      filters_enable.department && filter_obj.department.length > 0
        ? filter_obj.department
        : null,
    category:
      filters_enable.category && filter_obj.category.length > 0
        ? filter_obj.category
        : null,
    enroll_method:
      filters_enable.enroll_method && filter_obj.enroll_method.length > 0
        ? filter_obj.enroll_method
        : null,
    strict_match: strict_match_bool,
  };
  const { data } = await instance.post(`${api_version}/courses/search`, {
    keyword: searchString,
    fields: fields,
    filter: filter,
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
