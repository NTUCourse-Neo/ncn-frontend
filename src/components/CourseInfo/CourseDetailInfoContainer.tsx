import {
  Flex,
  Box,
  Text,
  HStack,
  Center,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { IoWarningOutline } from "react-icons/io5";
import React, { useState, useMemo } from "react";
import { info_view_map } from "data/mapping_table";
import { parseCourseTimeLocation } from "utils/parseCourseSchedule";
import {
  EnrollStatusPanel,
  SyllabusPanel,
  GradePolicyPanel,
} from "components/CourseInfo/Panel";
import type { Course } from "types/course";
import { CoffeeOutlineIcon } from "@/components/CustomIcons";

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

function BasicInfoDataCell({
  title,
  content,
  useTooltip = false,
  tooltipText = "",
}: {
  readonly title: string;
  readonly content?: string | null;
  readonly useTooltip?: boolean;
  readonly tooltipText?: string;
}) {
  return (
    <Flex
      w="100%"
      borderBottom={"1px solid #909090"}
      pb={4}
      justifyContent="space-between"
      sx={{
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: 1.4,
      }}
    >
      <Text
        sx={{
          color: "#4b4b4b",
        }}
      >
        {title}
      </Text>
      {!useTooltip ? (
        <Text color="#2d2d2d" noOfLines={1}>
          {content || "-"}
        </Text>
      ) : (
        <Tooltip label={tooltipText}>
          <Text color="#2d2d2d" noOfLines={1} cursor="pointer">
            {content || "-"}
          </Text>
        </Tooltip>
      )}
    </Flex>
  );
}

function BasicInfoTab({ course }: { readonly course: Course }) {
  const timeLocationPairs = parseCourseTimeLocation(course.schedules);
  return (
    <Box>
      <Flex w="100%">
        <Flex
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: 1.4,
            color: "#2d2d2d",
          }}
        >{`授課語言：${info_view_map.language.map[course.language]}`}</Flex>
      </Flex>
      <Flex
        mt={8}
        w="100%"
        h="320px"
        justify={"space-between"}
        alignItems={"start"}
      >
        <Flex w="20%" flexDirection={"column"} gap={6}>
          <BasicInfoDataCell title="流水號" content={course.serial} />
          <BasicInfoDataCell title="課程識別碼" content={course.identifier} />
          <BasicInfoDataCell title="課號" content={course.code} />
          <BasicInfoDataCell title="班次" content={course?.class} />
          <BasicInfoDataCell
            title="學分"
            content={
              course?.credits ? course.credits.toString().padStart(2, "0") : "-"
            }
          />
        </Flex>
        <Flex w="33%" flexDirection={"column"} gap={6}>
          <BasicInfoDataCell
            title="開課系所"
            content={
              course.departments.length > 1
                ? "多個系所"
                : course.departments?.[0]?.name_full ?? "-"
            }
            useTooltip={course.departments.length > 1}
            tooltipText={course.departments.map((d) => d.name_full).join(", ")}
          />
          <BasicInfoDataCell title="授課教師" content={course.teacher} />
          <BasicInfoDataCell
            title="上課時間"
            content={timeLocationPairs.map((p) => p.time).join(", ")}
          />
          <BasicInfoDataCell
            title="上課地點"
            content={timeLocationPairs.map((p) => p.location).join(", ")}
          />
          <BasicInfoDataCell
            title="加選方式"
            content={
              `${course.enroll_method} - ${
                info_view_map.enroll_method.map[course.enroll_method]
              }` ?? "-"
            }
          />
        </Flex>
        <Flex w="33%" flexDirection={"column"} gap={6}>
          <BasicInfoDataCell
            title="課程類別"
            content={info_view_map.requirement.map[course.requirement]}
          />
          <BasicInfoDataCell title="領域專長" content={"-"} />
          <BasicInfoDataCell
            title="修課總人數"
            content={course.slot.toString()}
          />
          <BasicInfoDataCell title="Office Hour" content={"-"} />
        </Flex>
      </Flex>
      <Flex w="100%" justifyContent={"space-between"}>
        <Flex
          w="60%"
          flexDirection="column"
          alignItems="start"
          justifyContent="start"
          borderRadius="4px"
          gap={"12px"}
          p={4}
          sx={{
            bg: "#f6f6f6",
            borderRadius: "4px",
          }}
        >
          {course?.limitation ? (
            <Flex
              w="100%"
              flexDirection="column"
              alignItems="start"
              justifyContent="start"
              gap={2}
            >
              <HStack
                spacing={1}
                color="error.main"
                sx={{
                  fontSize: "12px",
                  lineHeight: "1.4",
                  fontWeight: 500,
                }}
              >
                <Center h="100%">
                  <IoWarningOutline />
                </Center>
                <Text> 修課限制 </Text>
              </HStack>
              <Text
                mx="2px"
                sx={{
                  fontSize: "12px",
                  lineHeight: "1.4",
                  fontWeight: 400,
                  color: "#2d2d2d",
                }}
              >
                {course?.limitation ?? "無"}
              </Text>
            </Flex>
          ) : null}
          <Flex
            w="100%"
            flexDirection="column"
            alignItems="start"
            justifyContent="start"
            gap={2}
          >
            <HStack
              spacing={1}
              color="#6f6f6f"
              sx={{
                fontSize: "12px",
                lineHeight: "1.4",
                fontWeight: 500,
              }}
            >
              <Text> 備註 </Text>
            </HStack>
            <Text
              sx={{
                fontSize: "12px",
                lineHeight: "1.4",
                fontWeight: 400,
                color: "#6f6f6f",
              }}
            >
              {course?.note || "無"}
            </Text>
          </Flex>
        </Flex>
        <Flex
          w="33%"
          flexDirection="column"
          sx={{
            bg: "#F6F6F6",
            borderRadius: "4px",
            pt: 4,
            px: 4,
            pb: 6,
          }}
        >
          <Flex
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: 1.4,
              color: "#2d2d2d",
            }}
            cursor="default"
          >
            已選人數
            <Tag colorScheme={"secondary"} size="sm" ml={3}>
              <TagLeftIcon as={ArrowForwardIcon} color={"#BBF7D0"} />
              <TagLabel>即時</TagLabel>
            </Tag>
          </Flex>
          <EnrollStatusPanel courseSerial={course.serial} />
        </Flex>
      </Flex>
    </Box>
  );
}

function CourseRulesTab({ course }: { readonly course: Course }) {
  const a = <GradePolicyPanel courseId={course.id} />;
  return (
    <Box>
      {/* TODO: syllabus.workload */}
      <Flex
        w="100%"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "1.4",
          color: "#2d2d2d",
        }}
      >{`預計每週課後學習時數：${"2~3 小時"}`}</Flex>{" "}
      <SyllabusPanel courseId={course.id} />
    </Box>
  );
}

function CourseScheduleTab({ course }: { readonly course: Course }) {
  return (
    <Center h="60vh">
      <Flex
        flexDirection={"column"}
        justifyContent="center"
        alignItems={"center"}
      >
        <CoffeeOutlineIcon color="#909090" boxSize={"40px"} />
        <Flex
          mt={2}
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.4,
            color: "#909090",
          }}
        >{`尚未提供`}</Flex>
      </Flex>
    </Center>
  );
}

function CourseDetailInfoContainer({ course }: { readonly course: Course }) {
  const [tabId, setTabId] = useState<TabId>("basicInfo");
  const tabContent = useMemo<Record<TabId, JSX.Element>>(
    () => ({
      basicInfo: <BasicInfoTab course={course} />,
      courseRules: <CourseRulesTab course={course} />,
      courseSchedule: <CourseScheduleTab course={course} />,
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
          px: 10,
          py: 6,
        }}
      >
        {tabContent[tabId]}
      </Box>
    </Box>
  );
}

export default CourseDetailInfoContainer;
