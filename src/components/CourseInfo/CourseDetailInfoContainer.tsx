import { Flex, Box } from "@chakra-ui/react";
import React, { useState, useMemo } from "react";
import { info_view_map } from "data/mapping_table";
// import parseCourseSchedlue from "utils/parseCourseSchedule";
import {
  EnrollStatusPanel,
  SyllabusPanel,
  GradePolicyPanel,
} from "components/CourseInfo/Panel";
import type { Course } from "types/course";

const tabs = [
  {
    id: "basicInfo",
    chinese_label: "基本資訊",
  },
  {
    id: "courseRules",
    chinese_label: "課程規定",
  },
  {
    id: "courseSchedule",
    chinese_label: "課程進度",
  },
] as const;
type TabId = typeof tabs[number]["id"];

// TODO:
function BasicInfoTab({ course }: { readonly course: Course }) {
  return <Box>123</Box>;
}

function CourseDetailInfoContainer({ course }: { readonly course: Course }) {
  const course_codes_1 = [
    { title: "流水號", value: course.serial },
    { title: "課號", value: course.code },
    { title: "課程識別碼", value: course.identifier },
    { title: "班次", value: course?.class ?? "無" },
  ];
  const course_codes_2 = [
    { title: "人數上限", value: course.slot },
    {
      title: "必選修",
      value: info_view_map.requirement.map[course.requirement],
    },
    { title: "開課學期", value: course.semester },
    { title: "授課語言", value: info_view_map.language.map[course.language] },
  ];
  const enrollMethodStats = <EnrollStatusPanel courseSerial={course.serial} />;
  const syllabusPanel = <SyllabusPanel courseId={course.id} />;
  const gradingPolicyPanel = <GradePolicyPanel courseId={course.id} />;

  const [tabId, setTabId] = useState<TabId>("basicInfo");
  const tabContent = useMemo<Record<TabId, JSX.Element>>(
    () => ({
      basicInfo: <BasicInfoTab course={course} />,
      courseRules: <></>,
      courseSchedule: <></>,
    }),
    [course]
  );

  return (
    <Box
      mt={4}
      sx={{
        borderRadius: "4px",
      }}
    >
      <Flex
        h="46px"
        justify={"center"}
        bg="#002F94"
        sx={{
          borderRadius: "4px 4px 0 0",
        }}
        gap={"64px"}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === tabId;
          return (
            <Flex
              key={tab.id}
              sx={{
                color: isActive ? "white" : "#ffffff80",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: 1.4,
                borderBottom: `2px solid ${
                  isActive ? "#FFFFFF" : "transparent"
                }`,
              }}
              h="100%"
              alignItems={"center"}
              onClick={() => setTabId(tab.id)}
              transition={"0.3s ease-in-out"}
            >
              {tab.chinese_label}
            </Flex>
          );
        })}
      </Flex>
      <Box
        w="100%"
        minH="60vh"
        sx={{
          borderRadius: "0 0 4px 4px",
          shadow: "0px 3px 8px rgba(75, 75, 75, 0.08)",
          border: "1px solid rgba(204, 204, 204, 0.4)",
          p: 10,
        }}
      >
        {tabContent[tabId]}
      </Box>
    </Box>
  );
}

export default CourseDetailInfoContainer;
