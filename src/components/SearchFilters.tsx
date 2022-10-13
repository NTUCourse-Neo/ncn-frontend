import {
  Flex,
  Stack,
  Checkbox,
  Text,
  Divider,
  Box,
  Badge,
  FlexProps,
  HStack,
  Icon,
  Fade,
  Button,
} from "@chakra-ui/react";
import React, { forwardRef, useRef, useState } from "react";
import TimeFilterModal from "@/components/FilterModals/TimeFilterModal";
import DeptFilterModal from "@/components/FilterModals/DeptFilterModal";
import { FaChevronDown } from "react-icons/fa";
import useOutsideDetecter from "@/hooks/useOutsideDetecter";
import { mapStateToIntervals } from "utils/timeTableConverter";
import { useCourseSearchingContext } from "@/components/Providers/CourseSearchingProvider";
import {
  EnrollMethod,
  grades,
  Grade,
  otherLimits,
  OtherLimit,
} from "types/search";
import {
  isEnrollMethodFilterActive,
  isTargetGradeFilterActive,
} from "utils/searchFilter";
import _ from "lodash";

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

const FilterDropDown = forwardRef<
  HTMLDivElement,
  {
    readonly id?: string;
    readonly title: string;
    readonly isOpen: boolean;
    readonly children: React.ReactNode;
    readonly onClick: () => void;
    readonly onSave: () => void;
    readonly onClear: () => void;
    readonly isEmpty?: boolean;
    readonly isActive?: boolean;
  }
>((props, ref) => {
  const {
    id = "",
    title,
    isOpen,
    isEmpty = false,
    isActive = false,
    children,
    onClick,
    onClear,
    onSave,
  } = props;
  const isDarkBackground = isActive || isOpen;
  return (
    <Flex
      position="relative"
      flexDirection={"column"}
      alignItems="start"
      justifyContent={"start"}
      sx={{
        transition: "all 0.4s ease-in-out",
      }}
    >
      <FilterButton
        onClick={onClick}
        bg={isDarkBackground ? "#cccccc" : "white"}
        id={id}
      >
        <HStack id={id}>
          <Text id={id}>{title}</Text>
          <Icon
            id={id}
            as={FaChevronDown}
            transform={isOpen ? "rotate(180deg)" : ""}
            transition="all ease-in-out 0.4s"
          />
        </HStack>
      </FilterButton>
      <Fade in={isOpen} unmountOnExit={true}>
        <Box
          ref={ref}
          boxSizing="border-box"
          sx={{
            transition: "all 1s ease-in-out",
            border: "0.5px solid #6F6F6F",
            borderRadius: "4px",
          }}
          top="42px"
          w="fit-content"
          bg="white"
          position="absolute"
          color="black"
          zIndex={1000}
        >
          <Flex flexDirection={"column"} gap={3} p={6}>
            {children}
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
                onClick={onSave}
              >
                套用
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Fade>
    </Flex>
  );
});
FilterDropDown.displayName = "FilterDropDown";

function SearchFilters(props: FlexProps) {
  const [openPanel, setOpenPanel] = useState<
    null | "registerMethod" | "targetGrade" | "otherLimit"
  >(null);
  const registerMethodRef = useRef<HTMLDivElement>(null);
  const targetStudentRef = useRef<HTMLDivElement>(null);
  const otherLimitRef = useRef<HTMLDivElement>(null);
  useOutsideDetecter(registerMethodRef, "registerMethod", () => {
    setOpenPanel(null);
  });
  useOutsideDetecter(targetStudentRef, "targetGrade", () => {
    setOpenPanel(null);
  });
  useOutsideDetecter(otherLimitRef, "otherLimit", () => {
    setOpenPanel(null);
  });
  const { searchFilters, setSearchFilters, resetFilters, isFiltersEdited } =
    useCourseSearchingContext();

  const [selectedEnrollMethod, setSelectedEnrollMethod] = useState<
    EnrollMethod[]
  >(searchFilters.enroll_method);
  const [selectedTargetGrade, setSelectedTargetGrade] = useState<Grade[]>(
    searchFilters.target_grade
  );
  const [selectedOtherLimit, setSelectedOtherLimit] = useState<OtherLimit[]>(
    searchFilters.other_limit
  );
  const otherLimitsGroupByType = _.groupBy(
    otherLimits,
    (limit) => limit.type_label
  );

  return (
    <Flex alignItems={"center"} flexWrap="wrap" gap="3" {...props}>
      <TimeFilterModal
        title={`上課時間${
          mapStateToIntervals(searchFilters.time) === 0
            ? ""
            : ` (${mapStateToIntervals(searchFilters.time)})`
        }`}
        isActive={
          mapStateToIntervals(searchFilters.time) > 0 ||
          searchFilters.is_full_year !== null
        }
      />
      <DeptFilterModal
        title={`開課系所${
          searchFilters.department.length > 0
            ? ` (${searchFilters.department.length})`
            : ""
        }`}
        isActive={
          searchFilters.department.length > 0 ||
          searchFilters.is_selective !== null
        }
      />
      <FilterDropDown
        id="registerMethod"
        ref={registerMethodRef}
        isOpen={openPanel === "registerMethod"}
        title={`加選方式${
          isEnrollMethodFilterActive(searchFilters.enroll_method)
            ? ` (${[...searchFilters.enroll_method].sort().join(", ")})`
            : ""
        }`}
        onClick={() => {
          if (openPanel === "registerMethod") {
            setOpenPanel(null);
          } else {
            setSelectedEnrollMethod(searchFilters.enroll_method);
            setOpenPanel("registerMethod");
          }
        }}
        onSave={() => {
          setSearchFilters({
            ...searchFilters,
            enroll_method: selectedEnrollMethod,
          });
          setOpenPanel(null);
        }}
        onClear={() => {
          setSelectedEnrollMethod([]);
        }}
        isEmpty={selectedEnrollMethod.length === 0}
        isActive={isEnrollMethodFilterActive(searchFilters.enroll_method)}
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
      </FilterDropDown>
      <FilterDropDown
        id="targetGrade"
        ref={targetStudentRef}
        isOpen={openPanel === "targetGrade"}
        title={`授課年級${
          isTargetGradeFilterActive(searchFilters.target_grade)
            ? ` (${searchFilters.target_grade.length})`
            : ""
        }`}
        onClick={() => {
          if (openPanel === "targetGrade") {
            setOpenPanel(null);
          } else {
            setSelectedTargetGrade(searchFilters.target_grade);
            setOpenPanel("targetGrade");
          }
        }}
        onSave={() => {
          setSearchFilters({
            ...searchFilters,
            target_grade: selectedTargetGrade,
          });
          setOpenPanel(null);
        }}
        onClear={() => {
          setSelectedTargetGrade([]);
        }}
        isEmpty={selectedTargetGrade.length === 0}
        isActive={isTargetGradeFilterActive(searchFilters.target_grade)}
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
      </FilterDropDown>
      <FilterDropDown
        id="otherLimit"
        ref={otherLimitRef}
        isOpen={openPanel === "otherLimit"}
        title={`其他限制${
          searchFilters.other_limit.length > 0
            ? ` (${searchFilters.other_limit.length})`
            : ``
        }`}
        onClick={() => {
          if (openPanel === "otherLimit") {
            setOpenPanel(null);
          } else {
            setSelectedOtherLimit(searchFilters.other_limit);
            setOpenPanel("otherLimit");
          }
        }}
        onSave={() => {
          setSearchFilters({
            ...searchFilters,
            other_limit: selectedOtherLimit,
          });
          setOpenPanel(null);
        }}
        onClear={() => {
          setSelectedOtherLimit([]);
        }}
        isEmpty={selectedOtherLimit.length === 0}
        isActive={searchFilters.other_limit.length > 0}
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
          {Object.entries(otherLimitsGroupByType).map(
            ([type, limits], index) => {
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
                            getNextCheckListState(
                              selectedOtherLimit,
                              limit.value
                            )
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
            }
          )}
        </Stack>
      </FilterDropDown>
      {isFiltersEdited ? (
        <Box
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: "#484848",
          }}
          cursor="pointer"
          onClick={() => {
            resetFilters();
          }}
        >
          清除全部
        </Box>
      ) : null}
    </Flex>
  );
}

export default SearchFilters;
