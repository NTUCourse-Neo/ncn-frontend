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
import React, { useState, useMemo } from "react";
import TimeFilterModal from "@/components/Filters/TimeFilterModal";
import DeptFilterModal from "@/components/Filters/DeptFilterModal";
import ProgramFilterModal from "@/components/Filters/ProgramFilterModal";
import SingleDeptFilterModal from "@/components/Filters/SingleDeptFilterModal";
import GroupingCourseFilterModal from "@/components/Filters/GroupingCourseFilter";
import { FaChevronDown } from "react-icons/fa";
import { mapStateToIntervals } from "utils/timeTableConverter";
import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
import {
  EnrollMethod,
  otherLimits,
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

export function SingleDeptFilter() {
  const { searchFilters, isFilterEdited } = useCourseSearchingContext();
  return (
    <SingleDeptFilterModal
      title={`系所必選修`}
      isActive={isFilterEdited("single_dept")}
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

export function GroupingCourseTypeFilter() {
  const { searchFilters, isFilterEdited } = useCourseSearchingContext();
  return (
    <GroupingCourseFilterModal
      title={`課程種類${
        isFilterEdited("grouping_course_type")
          ? ` (${searchFilters.grouping_course_type.length})`
          : ""
      }`}
      isActive={isFilterEdited("grouping_course_type")}
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

type limitId = typeof otherLimits[number]["value"];

export function OtherLimitFilter() {
  const { searchFilters, setSearchFilters, setPageIndex, isFilterEdited } =
    useCourseSearchingContext();
  const [isEnglishTaught, setIsEnglishTaught] = useState(
    searchFilters.isEnglishTaught
  );
  const [isDistanceLearning, setIsDistanceLearning] = useState(
    searchFilters.isDistanceLearning
  );
  const [hasChanged, setHasChanged] = useState(searchFilters.hasChanged);
  const [isAdditionalCourse, setIsAdditionalCourse] = useState(
    searchFilters.isAdditionalCourse
  );
  const [noPrerequisite, setNoPrerequisite] = useState(
    searchFilters.noPrerequisite
  );
  const [noConflictOnly, setNoConflictOnly] = useState(
    searchFilters.noConflictOnly
  );
  const [notEnrolledOnly, setNotEnrolledOnly] = useState(
    searchFilters.notEnrolledOnly
  );

  const limitIdStateMap: Record<
    limitId,
    {
      state: boolean;
      setState: React.Dispatch<React.SetStateAction<boolean>>;
    }
  > = useMemo(
    () => ({
      isEnglishTaught: {
        state: isEnglishTaught,
        setState: setIsEnglishTaught,
      },
      isDistanceLearning: {
        state: isDistanceLearning,
        setState: setIsDistanceLearning,
      },
      hasChanged: {
        state: hasChanged,
        setState: setHasChanged,
      },
      isAdditionalCourse: {
        state: isAdditionalCourse,
        setState: setIsAdditionalCourse,
      },
      noPrerequisite: {
        state: noPrerequisite,
        setState: setNoPrerequisite,
      },
      noConflictOnly: {
        state: noConflictOnly,
        setState: setNoConflictOnly,
      },
      notEnrolledOnly: {
        state: notEnrolledOnly,
        setState: setNotEnrolledOnly,
      },
    }),
    [
      isEnglishTaught,
      isDistanceLearning,
      hasChanged,
      isAdditionalCourse,
      noPrerequisite,
      notEnrolledOnly,
      noConflictOnly,
    ]
  );
  const numOfTrues = useMemo(() => {
    return Object.values(limitIdStateMap).filter((item) => item.state).length;
  }, [limitIdStateMap]);

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
          ? ` (${
              [
                searchFilters.isEnglishTaught,
                searchFilters.isDistanceLearning,
                searchFilters.hasChanged,
                searchFilters.isAdditionalCourse,
                searchFilters.noPrerequisite,
                searchFilters.noConflictOnly,
                searchFilters.notEnrolledOnly,
              ].filter((item) => item).length
            })`
          : ``
      }`}
      onClick={() => {
        // sync from context
        setIsEnglishTaught(searchFilters.isEnglishTaught);
        setIsDistanceLearning(searchFilters.isDistanceLearning);
        setHasChanged(searchFilters.hasChanged);
        setIsAdditionalCourse(searchFilters.isAdditionalCourse);
        setNoPrerequisite(searchFilters.noPrerequisite);
        setNoConflictOnly(searchFilters.noConflictOnly);
        setNotEnrolledOnly(searchFilters.notEnrolledOnly);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          // sync to context
          isEnglishTaught: isEnglishTaught,
          isDistanceLearning: isDistanceLearning,
          hasChanged: hasChanged,
          isAdditionalCourse: isAdditionalCourse,
          noPrerequisite: noPrerequisite,
          noConflictOnly: noConflictOnly,
          notEnrolledOnly: notEnrolledOnly,
        });
        backToFirstPage();
      }}
      onClear={() => {
        // set all to false
        Object.values(limitIdStateMap).forEach((item) => {
          item.setState(false);
        });
      }}
      isEmpty={numOfTrues === 0} // all false
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
                    isChecked={limitIdStateMap[limit.value].state}
                    onChange={() => {
                      limitIdStateMap[limit.value].setState((prev) => !prev);
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
  >(searchFilters.generalCourseTypes);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`課程類別${
        isFilterEdited("general_course_type")
          ? ` (${searchFilters.generalCourseTypes.length})`
          : ""
      }`}
      onClick={() => {
        setSelectedGeneralCourseType(searchFilters.generalCourseTypes);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          generalCourseTypes: selectedGeneralCourseType,
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
    useState<CommonTargetDepartment[]>(searchFilters.commonTargetDepartments);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`授課對象${
        isFilterEdited("common_target_dept")
          ? ` (${searchFilters.commonTargetDepartments.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedCommonTargetDepartment(
          searchFilters.commonTargetDepartments
        );
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          commonTargetDepartments: selectedCommonTargetDepartment,
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
  >(searchFilters.commonCourseTypes);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`領域別${
        isFilterEdited("common_course_type")
          ? ` (${searchFilters.commonCourseTypes.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedCommonCourseType(searchFilters.commonCourseTypes);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          commonCourseTypes: selectedCommonCourseType,
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
  >(searchFilters.peArmyCourseTypes);
  const backToFirstPage = () => {
    setPageIndex(0);
  };

  return (
    <FilterDropdown
      title={`課程類別${
        isFilterEdited("pearmy_course_type")
          ? ` (${searchFilters.peArmyCourseTypes.length})`
          : ``
      }`}
      onClick={() => {
        setSelectedPeArmyCourseType(searchFilters.peArmyCourseTypes);
      }}
      onSave={() => {
        setSearchFilters({
          ...searchFilters,
          peArmyCourseTypes: selectedPeArmyCourseType,
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
