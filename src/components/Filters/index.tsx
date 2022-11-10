import {
  Flex,
  Stack,
  Checkbox,
  Text,
  Divider,
  Badge,
  FlexProps,
  HStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import TimeFilterModal from "@/components/Filters/TimeFilterModal";
import DeptFilterModal from "@/components/Filters/DeptFilterModal";
import ProgramFilterModal from "@/components/Filters/ProgramFilterModal";
import { FaChevronDown } from "react-icons/fa";
import { mapStateToIntervals } from "utils/timeTableConverter";
import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
import {
  EnrollMethod,
  grades,
  Grade,
  otherLimits,
  OtherLimit,
  GeneralCourseType,
  generalCourseTypes,
  CommonTargetDepartment,
  commonTargetDepartments,
  CommonCourseType,
  commonCourseTypes,
  PeArmyCourseType,
  peArmyCourseTypes,
  HostCollege,
  hostColleges,
} from "types/search";
import _ from "lodash";
import Dropdown from "@/components/Dropdown";

function getNextCheckListState<T>(array: T[], member: T): T[] {
  const idx = array.indexOf(member);
  if (idx === -1) {
    return [...array, member];
  } else {
    return array.filter((item) => item !== member);
  }
}

function FilterButton(props: FlexProps) {
  return (
    <Flex
      borderRadius={"24px"}
      height="36px"
      px="16px"
      py="6px"
      border="0.5px solid #4B4B4B"
      alignItems={"center"}
      color="#4b4b4b"
      cursor={"pointer"}
      transition={"all 0.2s ease-in-out"}
      _hover={{
        bg: "#4b4b4b20",
      }}
      {...props}
    />
  );
}

function FilterDropdown(props: {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly onSave: () => void;
  readonly onClear: () => void;
  readonly isEmpty?: boolean;
  readonly isActive?: boolean;
}) {
  const {
    title,
    children,
    onClick,
    onSave,
    onClear,
    isEmpty = false,
    isActive = false,
  } = props;
  return (
    <Dropdown
      renderDropdownButton={(isOpen) => (
        <FilterButton
          onClick={onClick}
          bg={isActive || isOpen ? "#cccccc" : "white"}
        >
          <HStack>
            <Text>{title}</Text>
            <Icon
              as={FaChevronDown}
              transform={isOpen ? "rotate(180deg)" : ""}
              transition="all ease-in-out 0.4s"
            />
          </HStack>
        </FilterButton>
      )}
      renderDropdownFooter={(setIsOpen) => (
        <Flex flexDirection={"column"} gap={3} px={6} pb={6}>
          <Divider />
          <Flex justifyContent={"end"} alignItems={"center"}>
            <Button
              variant={"unstyled"}
              sx={{
                color: "#4b4b4b",
                fontSize: "13px",
                lineHeight: "18px",
                fontWeight: 600,
              }}
              onClick={onClear}
              isDisabled={isEmpty}
              ml={6}
            >
              清除
            </Button>
            <Button
              ml="2"
              w="58px"
              h="34px"
              sx={{
                borderRadius: "50px",
                fontSize: "13px",
                lineHeight: "18px",
                fontWeight: 600,
                bg: "#4b4b4b",
                _hover: {
                  bg: "#4b4b4b",
                  opacity: 0.8,
                },
                _active: {
                  bg: "#4b4b4b",
                  opacity: 0.7,
                },
              }}
              onClick={() => {
                onSave();
                setIsOpen(false);
              }}
            >
              套用
            </Button>
          </Flex>
        </Flex>
      )}
    >
      <Flex flexDirection={"column"} p={6} whiteSpace="nowrap">
        {children}
      </Flex>
    </Dropdown>
  );
}

export function TimeFilter() {
  const { searchFilters, isFilterEdited } = useCourseSearchingContext();
  return (
    <TimeFilterModal
      title={`上課時間${
        mapStateToIntervals(searchFilters.time) === 0
          ? ""
          : ` (${mapStateToIntervals(searchFilters.time)})`
      }`}
      isActive={isFilterEdited("time")}
    />
  );
}

export function DeptFilter() {
  const { searchFilters, isFilterEdited } = useCourseSearchingContext();
  return (
    <DeptFilterModal
      title={`開課系所${
        searchFilters.department.length > 0
          ? ` (${searchFilters.department.length})`
          : ""
      }`}
      isActive={isFilterEdited("dept")}
    />
  );
}

export function ProgramFilter() {
  const { searchFilters, isFilterEdited } = useCourseSearchingContext();
  return (
    <ProgramFilterModal
      title={`開課學程${
        isFilterEdited("program") ? ` (${searchFilters.program.length})` : ""
      }`}
      isActive={isFilterEdited("program")}
    />
  );
}

export function EnrollMethodFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();

  const [selectedEnrollMethod, setSelectedEnrollMethod] = useState<
    EnrollMethod[]
  >(searchFilters.enroll_method);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`加選方式${
        isFilterEdited("enroll_method")
          ? ` (${[...searchFilters.enroll_method].sort().join(", ")})`
          : ""
      }`}
      onClick={() => {
        setSelectedEnrollMethod(searchFilters.enroll_method);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          enroll_method: selectedEnrollMethod,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedEnrollMethod([]);
      }}
      isEmpty={selectedEnrollMethod.length === 0}
      isActive={isFilterEdited("enroll_method")}
    >
      <Stack
        w="280px"
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
      >
        <Checkbox
          isChecked={selectedEnrollMethod.includes("1")}
          onChange={() => {
            setSelectedEnrollMethod(
              getNextCheckListState(selectedEnrollMethod, "1")
            );
          }}
        >
          1 - 不限人數，直接上網加選
        </Checkbox>
        <Checkbox
          isChecked={selectedEnrollMethod.includes("2")}
          onChange={() => {
            setSelectedEnrollMethod(
              getNextCheckListState(selectedEnrollMethod, "2")
            );
          }}
        >
          2 - 向教師取得授權碼後加選
        </Checkbox>
        <Checkbox
          isChecked={selectedEnrollMethod.includes("3")}
          onChange={() => {
            setSelectedEnrollMethod(
              getNextCheckListState(selectedEnrollMethod, "3")
            );
          }}
        >
          3 - 有人數限制，上網登記後分發
        </Checkbox>
      </Stack>
    </FilterDropdown>
  );
}

export function TargetGradeFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedTargetGrade, setSelectedTargetGrade] = useState<Grade[]>(
    searchFilters.target_grade
  );
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`可修課年級${
        isFilterEdited("target_grade")
          ? ` (${searchFilters.target_grade.length})`
          : ""
      }`}
      onClick={() => {
        setSelectedTargetGrade(searchFilters.target_grade);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          target_grade: selectedTargetGrade,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedTargetGrade([]);
      }}
      isEmpty={selectedTargetGrade.length === 0}
      isActive={isFilterEdited("target_grade")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
        w="fit-content"
      >
        {grades.map((grade) => {
          return (
            <Checkbox
              key={grade.value}
              isChecked={selectedTargetGrade.includes(grade.value)}
              onChange={() => {
                setSelectedTargetGrade(
                  getNextCheckListState(selectedTargetGrade, grade.value)
                );
              }}
            >
              {grade.label}
            </Checkbox>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}

export function OtherLimitFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedOtherLimit, setSelectedOtherLimit] = useState<OtherLimit[]>(
    searchFilters.other_limit
  );
  const otherLimitsGroupByType = _.groupBy(
    otherLimits,
    (limit) => limit.type_label
  );
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`其他限制${
        isFilterEdited("other_limit")
          ? ` (${searchFilters.other_limit.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedOtherLimit(searchFilters.other_limit);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          other_limit: selectedOtherLimit,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedOtherLimit([]);
      }}
      isEmpty={selectedOtherLimit.length === 0}
      isActive={isFilterEdited("other_limit")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
        w="300px"
      >
        {Object.entries(otherLimitsGroupByType).map(([type, limits], index) => {
          return (
            <React.Fragment key={type}>
              {index !== 0 ? <Divider /> : null}
              <Stack spacing={3} w="fit-content">
                <Text
                  sx={{
                    fontSize: "16px",
                    lineHeight: "21px",
                    fontWeight: 600,
                  }}
                >
                  {type}
                </Text>
                {limits.map((limit) => (
                  <Checkbox
                    key={limit.label}
                    isDisabled={!limit.avaliable}
                    isChecked={selectedOtherLimit.includes(limit.value)}
                    onChange={() => {
                      setSelectedOtherLimit(
                        getNextCheckListState(selectedOtherLimit, limit.value)
                      );
                    }}
                  >
                    {limit.label}{" "}
                    {!limit.avaliable ? <Badge>即將推出</Badge> : null}
                  </Checkbox>
                ))}
              </Stack>
            </React.Fragment>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}

export function GeneralCourseTypeFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedGeneralCourseType, setSelectedGeneralCourseType] = useState<
    GeneralCourseType[]
  >(searchFilters.general_course_type);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`課程類別${
        isFilterEdited("general_course_type")
          ? ` (${searchFilters.general_course_type.length})`
          : ""
      }`}
      onClick={() => {
        setSelectedGeneralCourseType(searchFilters.general_course_type);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          general_course_type: selectedGeneralCourseType,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedGeneralCourseType([]);
      }}
      isEmpty={selectedGeneralCourseType.length === 0}
      isActive={isFilterEdited("general_course_type")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
        w="fit-content"
        gap={1}
      >
        {generalCourseTypes.map((courseType) => {
          return (
            <Checkbox
              key={courseType.value}
              isChecked={selectedGeneralCourseType.includes(courseType.value)}
              onChange={() => {
                setSelectedGeneralCourseType(
                  getNextCheckListState(
                    selectedGeneralCourseType,
                    courseType.value
                  )
                );
              }}
            >
              {courseType.chinese_label}
            </Checkbox>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}

export function CommonTargetDeptFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedCommonTargetDepartment, setSelectedCommonTargetDepartment] =
    useState<CommonTargetDepartment[]>(searchFilters.common_target_department);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`授課對象${
        isFilterEdited("common_target_dept")
          ? ` (${searchFilters.common_target_department.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedCommonTargetDepartment(
          searchFilters.common_target_department
        );
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          common_target_department: selectedCommonTargetDepartment,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedCommonTargetDepartment([]);
      }}
      isEmpty={selectedCommonTargetDepartment.length === 0}
      isActive={isFilterEdited("common_target_dept")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
        w="300px"
      >
        {commonTargetDepartments.map((dept) => {
          return (
            <Checkbox
              key={dept.value}
              isChecked={selectedCommonTargetDepartment.includes(dept.value)}
              onChange={() => {
                setSelectedCommonTargetDepartment(
                  getNextCheckListState(
                    selectedCommonTargetDepartment,
                    dept.value
                  )
                );
              }}
            >
              {`${dept.value}000 ${dept.chinese_label}`}
            </Checkbox>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}

export function CommonCourseTypeFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedCommonCourseType, setSelectedCommonCourseType] = useState<
    CommonCourseType[]
  >(searchFilters.common_course_type);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`領域別${
        isFilterEdited("common_course_type")
          ? ` (${searchFilters.common_course_type.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedCommonCourseType(searchFilters.common_course_type);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          common_course_type: selectedCommonCourseType,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedCommonCourseType([]);
      }}
      isEmpty={selectedCommonCourseType.length === 0}
      isActive={isFilterEdited("common_course_type")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
      >
        {commonCourseTypes.map((ctype) => {
          return (
            <Checkbox
              key={ctype.value}
              isChecked={selectedCommonCourseType.includes(ctype.value)}
              onChange={() => {
                setSelectedCommonCourseType(
                  getNextCheckListState(selectedCommonCourseType, ctype.value)
                );
              }}
            >
              {`${ctype.chinese_label}`}
            </Checkbox>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}

export function PeArmyCourseTypeFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedPeArmyCourseType, setSelectedPeArmyCourseType] = useState<
    PeArmyCourseType[]
  >(searchFilters.pearmy_course_type);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`課程類別${
        isFilterEdited("pearmy_course_type")
          ? ` (${searchFilters.pearmy_course_type.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedPeArmyCourseType(searchFilters.pearmy_course_type);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          pearmy_course_type: selectedPeArmyCourseType,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedPeArmyCourseType([]);
      }}
      isEmpty={selectedPeArmyCourseType.length === 0}
      isActive={isFilterEdited("pearmy_course_type")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
      >
        {peArmyCourseTypes.map((ctype) => {
          return (
            <Checkbox
              key={ctype.value}
              isChecked={selectedPeArmyCourseType.includes(ctype.value)}
              onChange={() => {
                setSelectedPeArmyCourseType(
                  getNextCheckListState(selectedPeArmyCourseType, ctype.value)
                );
              }}
            >
              {`${ctype.chinese_label}`}
            </Checkbox>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}

export function HostCollegeFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [selectedHostCollege, setSelectedHostCollege] = useState<HostCollege[]>(
    searchFilters.host_college
  );
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`開課學校${
        isFilterEdited("host_college")
          ? ` (${searchFilters.host_college.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedHostCollege(searchFilters.host_college);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          host_college: selectedHostCollege,
        });
        backToFirstPage();
      }}
      onClear={() => {
        setSelectedHostCollege([]);
      }}
      isEmpty={selectedHostCollege.length === 0}
      isActive={isFilterEdited("host_college")}
    >
      <Stack
        spacing={3}
        sx={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#666666",
          letterSpacing: "0.05em",
        }}
      >
        {hostColleges.map((c) => {
          return (
            <Checkbox
              key={c.value}
              isChecked={selectedHostCollege.includes(c.value)}
              onChange={() => {
                setSelectedHostCollege(
                  getNextCheckListState(selectedHostCollege, c.value)
                );
              }}
            >
              {`${c.chinese_label}`}
            </Checkbox>
          );
        })}
      </Stack>
    </FilterDropdown>
  );
}
